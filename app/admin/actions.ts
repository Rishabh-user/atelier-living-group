"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  SESSION_COOKIE,
  checkCredentials,
  clearLoginFailures,
  createSessionValue,
  isAdminConfigured,
  loginBlocked,
  noteLoginFailure,
  requireAdmin,
} from "@/lib/admin-auth";
import {
  MAX,
  blogAvailable,
  deleteCategory,
  deletePost,
  listCategoriesSafe,
  saveCategory,
  savePost,
  setStatus,
  slugify,
} from "@/lib/blog";

export type FormState = { error?: string; email?: string };

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function clientKey(): Promise<string> {
  const h = await headers();
  return (h.get("x-forwarded-for") ?? "local").split(",")[0].trim();
}

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  if (!isAdminConfigured()) {
    return {
      error:
        "The admin is not set up yet. Add ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET (24+ characters) to the environment.",
    };
  }

  const key = await clientKey();
  if (loginBlocked(key)) {
    return {
      error: "Too many attempts. Please wait a few minutes and try again.",
      email: String(formData.get("email") ?? ""),
    };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!checkCredentials(email, password)) {
    noteLoginFailure(key);
    await wait(700); // slows down guessing
    // The email is handed back so the field is not emptied when the form resets.
    return { error: "That email and password do not match.", email };
  }

  clearLoginFailures(key);
  const { value, maxAge } = createSessionValue();
  (await cookies()).set(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  redirect("/admin");
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

function textField(formData: FormData, name: string, limit: number): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

/** Only our own uploads or an https image may be used as a cover. */
function cleanImage(value: string): string | null {
  if (!value) return null;
  if (value.startsWith("/uploads/") || /^https:\/\//i.test(value)) return value.slice(0, 500);
  return null;
}

function refresh(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/blog/category/[category]", "page");
  revalidatePath("/admin/categories");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin");
}

/** Create or update. `id` is present in the form when editing. */
export async function savePostAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  if (!blogAvailable()) {
    return { error: "No database is connected, so posts cannot be saved. Set TURSO_DATABASE_URL." };
  }

  const title = textField(formData, "title", MAX.title);
  if (title.length < 3) return { error: "Give the post a title (at least 3 characters)." };

  const content = textField(formData, "content", MAX.content);
  const intent = formData.get("intent") === "publish" ? "published" : "draft";
  if (intent === "published" && content.length < 20) {
    return { error: "Write some content before publishing." };
  }

  const category = textField(formData, "category", MAX.categoryName);
  const known = (await listCategoriesSafe()).map((item) => item.name);
  if (!known.includes(category)) {
    return { error: "Choose a category. Add one under Categories if the list is empty." };
  }
  const rawId = Number(formData.get("id"));
  const id = Number.isInteger(rawId) && rawId > 0 ? rawId : undefined;

  let savedId: number;
  try {
    const saved = await savePost(
      {
        title,
        slug: slugify(textField(formData, "slug", MAX.slug)),
        excerpt: textField(formData, "excerpt", MAX.excerpt),
        content,
        coverImage: cleanImage(textField(formData, "coverImage", 500)),
        coverAlt: textField(formData, "coverAlt", MAX.alt) || null,
        category,
        seoDescription: textField(formData, "seoDescription", MAX.seo) || null,
        status: intent,
      },
      id,
    );
    savedId = saved.id;
    refresh(saved.slug);
  } catch (error) {
    console.error("admin: save failed", error);
    return { error: error instanceof Error ? error.message : "The post could not be saved." };
  }

  redirect(`/admin/${savedId}?saved=${intent}`);
}

export async function setStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = formData.get("status") === "published" ? "published" : "draft";
  if (!Number.isInteger(id)) return;
  const post = await setStatus(id, status);
  refresh(post.slug);
}

export async function deletePostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  const removed = await deletePost(id);
  refresh(removed?.slug);
}

// ---- Categories -----------------------------------------------------------

/** Create or update a category. `id` is in the form when editing. */
export async function saveCategoryAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  if (!blogAvailable()) return { error: "No database is connected. Set TURSO_DATABASE_URL." };

  const name = textField(formData, "name", MAX.categoryName);
  if (name.length < 2) return { error: "Give the category a name (at least 2 characters)." };

  const rawId = Number(formData.get("id"));
  const id = Number.isInteger(rawId) && rawId > 0 ? rawId : undefined;

  try {
    await saveCategory(
      {
        name,
        intro: textField(formData, "intro", MAX.categoryText),
        description: textField(formData, "description", MAX.categoryText),
      },
      id,
    );
  } catch (error) {
    console.error("admin: category save failed", error);
    return { error: error instanceof Error ? error.message : "The category could not be saved." };
  }

  // Posts and the category pages show the name, so they refresh too.
  refresh();
  revalidatePath("/blog", "layout");
  redirect(`/admin/categories?saved=${id ? "updated" : "created"}`);
}

export async function deleteCategoryAction(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return {};
  const result = await deleteCategory(id);
  if (!result.ok) return { error: result.error };
  refresh();
  revalidatePath("/blog", "layout");
  redirect("/admin/categories?saved=deleted");
}
