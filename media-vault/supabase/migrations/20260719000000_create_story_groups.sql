-- Adaptation Bridge: story_groups and story_group_items
-- Groups multiple products (different formats) under one story.

CREATE TABLE story_groups (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE story_group_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_group_id  uuid NOT NULL REFERENCES story_groups(id) ON DELETE CASCADE,
  product_id      text NOT NULL,
  format_type     text NOT NULL CHECK (format_type IN ('movie', 'book', 'manga', 'comic')),
  sequence_order  int NOT NULL DEFAULT 0
);

CREATE INDEX idx_sgi_story_group ON story_group_items(story_group_id);
CREATE INDEX idx_sgi_product     ON story_group_items(product_id);
