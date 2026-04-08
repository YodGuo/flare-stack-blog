CREATE TABLE `inquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_name` text NOT NULL,
	`contact_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`product_name` text,
	`quantity` text,
	`message` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `inquiries_email_created_idx` ON `inquiries` (`email`,`created_at`);
--> statement-breakpoint
CREATE INDEX `inquiries_product_created_idx` ON `inquiries` (`product_name`,`created_at`);
