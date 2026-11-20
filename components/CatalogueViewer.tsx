"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { books, pageSrc, type Book } from "@/content/catalogue";

/**
 * A 3D page-turning book.
 *
 * Pages are grouped into sheets: sheet k has page 2k on its front and page
 * 2k+1 on its back. `flipped` counts the sheets turned over to the left, so the
 * open spread is the back of sheet flipped-1 beside the front of sheet flipped.
 * Only sheets near the open spread render their images, so a 134-page book
 * loads a handful of files rather than all of them.
 *
 * On a phone one page is shown at a time with a short turn animation.
 */
export default function CatalogueViewer() {
  const [bookId, setBookId] = useState(books[0].id);
  const [flipped, setFlipped] = useState(0);
  const [single, setSingle] = useState(false);
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const stage = useRef<HTMLDivElement | null>(null);
  const root = useRef<HTMLDivElement | null>(null);
  const [full, setFull] = useState(false);
  const [zoom, setZoom] = useState(1);

  const book: Book = books.find((b) => b.id === bookId) ?? books[0];
  const ratio = book.width / book.height;
  // Image index of each page in reading order, without the skipped pages.
  const skip = book.skip ?? [];
  const order = Array.from({ length: book.pages }, (_, i) => i).filter(
    (i) => !skip.includes(i),
  );
  const total = order.length;
  const sheets = Math.ceil(total / 2);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const sync = () => setSingle(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const go = useCallback(
    (delta: number) => {
      if (single) {
        setDir(delta);
        setPage((p) => Math.min(total - 1, Math.max(0, p + delta)));
      } else {
        setFlipped((f) => Math.min(sheets, Math.max(0, f + delta)));
      }
    },
    [single, total, sheets],
  );

  // Arrow keys turn the pages while the viewer is on screen, except when the
  // reader is typing in a form. Swipes turn them on touch screens.
  useEffect(() => {
    const el = stage.current;
    let visible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.3 },
    );
    if (el) observer.observe(el);

    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (!visible) return;
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);

    let startX: number | null = null;
    const onStart = (event: TouchEvent) => {
      startX = event.touches[0].clientX;
    };
    const onEnd = (event: TouchEvent) => {
      if (startX === null) return;
      const dx = event.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    };
    el?.addEventListener("touchstart", onStart, { passive: true });
    el?.addEventListener("touchend", onEnd, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
      el?.removeEventListener("touchstart", onStart);
      el?.removeEventListener("touchend", onEnd);
    };
  }, [go]);

  useEffect(() => {
    const sync = () => setFull(document.fullscreenElement === root.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void root.current?.requestFullscreen?.();
  };

  const ZOOMS = [1, 1.5, 2, 3];
  const zoomBy = (delta: number) => {
    setZoom((z) => {
      const i = Math.max(0, ZOOMS.indexOf(z));
      return ZOOMS[Math.min(ZOOMS.length - 1, Math.max(0, i + delta))];
    });
  };

  // Zooming starts centred on the spread, from the top.
  useEffect(() => {
    const el = stage.current;
    if (!el || zoom === 1) return;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollTop = 0;
  }, [zoom]);

  // Drag to move around a zoomed page.
  useEffect(() => {
    const el = stage.current;
    if (!el || zoom === 1) return;
    let from: { x: number; y: number; left: number; top: number } | null = null;
    const down = (event: PointerEvent) => {
      from = {
        x: event.clientX,
        y: event.clientY,
        left: el.scrollLeft,
        top: el.scrollTop,
      };
      el.setPointerCapture(event.pointerId);
      el.dataset.drag = "true";
    };
    const move = (event: PointerEvent) => {
      if (!from) return;
      el.scrollLeft = from.left - (event.clientX - from.x);
      el.scrollTop = from.top - (event.clientY - from.y);
    };
    const up = () => {
      from = null;
      delete el.dataset.drag;
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [zoom]);

  const choose = (id: string) => {
    setBookId(id);
    setFlipped(0);
    setPage(0);
    setZoom(1);
  };

  const state =
    flipped === 0 ? "front" : flipped === sheets ? "back" : "open";

  const leftNo = (order[flipped * 2 - 1] ?? 0) + 1; // number of the left page
  const rightNo = (order[flipped * 2] ?? 0) + 1;
  const label = single
    ? `Page ${order[page] + 1} of ${book.pages}`
    : flipped === 0
      ? "Cover"
      : flipped === sheets
        ? "Back cover"
        : `Pages ${leftNo}–${rightNo} of ${book.pages}`;

  const atStart = single ? page === 0 : flipped === 0;
  const atEnd = single ? page === total - 1 : flipped === sheets;

  return (
    <div className="cat-viewer" ref={root} data-full={full}>
      <div className="cat-tabs" role="tablist" aria-label="Catalogues">
        {books.map((b) => (
          <button
            key={b.id}
            type="button"
            role="tab"
            aria-selected={b.id === book.id}
            onClick={() => choose(b.id)}
          >
            <span>{b.kicker}</span>
            {b.title}
          </button>
        ))}
      </div>

      <div
        className="cat-stage"
        ref={stage}
        data-zoom={zoom > 1}
        style={{ "--zoom": zoom } as React.CSSProperties}
      >
        {single ? (
          <div
            className="cat-single"
            style={{ "--ratio": ratio } as React.CSSProperties}
          >
            <Image
              key={`${book.id}-${page}`}
              className="cat-single-img"
              data-dir={dir}
              src={pageSrc(book, order[page])}
              alt={`${book.title}, page ${order[page] + 1}`}
              width={book.width}
              height={book.height}
              sizes="92vw"
              priority={page === 0}
              unoptimized
            />
          </div>
        ) : (
          <div
            className="cat-book"
            data-state={state}
            style={{ "--ratio": ratio } as React.CSSProperties}
          >
            {Array.from({ length: sheets }, (_, k) => {
              const isFlipped = k < flipped;
              const near = Math.abs(k - flipped) <= 3;
              const front = order[k * 2];
              const back = order[k * 2 + 1];
              return (
                <div
                  className="cat-sheet"
                  data-flipped={isFlipped}
                  key={`${book.id}-${k}`}
                  style={{ zIndex: isFlipped ? k + 1 : sheets - k }}
                >
                  <button
                    type="button"
                    className="cat-face cat-front"
                    tabIndex={-1}
                    aria-label="Next page"
                    onClick={() => zoom === 1 && go(1)}
                  >
                    {near && front !== undefined ? (
                      <Image
                        src={pageSrc(book, front)}
                        alt={`${book.title}, page ${front + 1}`}
                        width={book.width}
                        height={book.height}
                        sizes="(max-width: 1100px) 46vw, 500px"
                        priority={k === 0}
                        unoptimized
                      />
                    ) : null}
                  </button>
                  <button
                    type="button"
                    className="cat-face cat-back"
                    tabIndex={-1}
                    aria-label="Previous page"
                    onClick={() => zoom === 1 && go(-1)}
                  >
                    {near && back !== undefined ? (
                      <Image
                        src={pageSrc(book, back)}
                        alt={`${book.title}, page ${back + 1}`}
                        width={book.width}
                        height={book.height}
                        sizes="(max-width: 1100px) 46vw, 500px"
                        unoptimized
                      />
                    ) : null}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="cat-controls">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={atStart}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </button>
        <p aria-live="polite">{label}</p>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={atEnd}
          aria-label="Next page"
        >
          <ChevronRight />
        </button>
        <button
          type="button"
          className="cat-zoom"
          onClick={() => zoomBy(-1)}
          disabled={zoom === 1}
          aria-label="Zoom out"
        >
          <ZoomOut />
        </button>
        <span className="cat-zoom-level" aria-live="polite">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          className="cat-zoom"
          onClick={() => zoomBy(1)}
          disabled={zoom === 3}
          aria-label="Zoom in"
        >
          <ZoomIn />
        </button>
        <button
          type="button"
          className="cat-full"
          onClick={toggleFull}
          aria-label={full ? "Exit full screen" : "View full screen"}
        >
          {full ? <Minimize2 /> : <Maximize2 />}
        </button>
      </div>

      <div className="cat-meta">
        <p>{book.description}</p>
        <a
          className="cat-download"
          href={book.pdf}
          download
        >
          <Download aria-hidden="true" />
          Download PDF
          <span>{book.pdfSize}</span>
        </a>
      </div>
    </div>
  );
}
