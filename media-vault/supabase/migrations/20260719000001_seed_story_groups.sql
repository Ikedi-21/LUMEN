-- Seed: two example story groups using existing admin products.
-- Run AFTER the 20260719000000 migration and after the admin products exist.

-- Story group 1: the two known admin products grouped together as a demo.
INSERT INTO story_groups (id, title)
VALUES ('a0000000-0000-0000-0000-000000000001', 'Test Adaptation');

INSERT INTO story_group_items (story_group_id, product_id, format_type, sequence_order)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'test-001',       'movie', 1),
  ('a0000000-0000-0000-0000-000000000001', 'admin-1783928614813', 'book',  2);
