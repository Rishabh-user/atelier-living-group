CREATE TABLE `inquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`project_type` text,
	`message` text,
	`created_at` text NOT NULL
);
