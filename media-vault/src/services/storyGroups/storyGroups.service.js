import { supabase } from "@/services/supabase/client";
import { getMediaById } from "@/services/media";

/**
 * Returns the story group (with all member items resolved) for a given
 * product, or null if the product isn't part of any group.
 *
 * @param {string} productId
 * @returns {Promise<{ storyGroupId: string, title: string, items: Array } | null>}
 */
export async function getStoryGroupForProduct(productId) {
  try {
    // 1. Find which story group this product belongs to
    const { data: membership, error: membershipError } = await supabase
      .from("story_group_items")
      .select("story_group_id")
      .eq("product_id", productId)
      .limit(1)
      .single();

    if (membershipError || !membership) return null;

    // 2. Fetch the group metadata
    const { data: group, error: groupError } = await supabase
      .from("story_groups")
      .select("id, title")
      .eq("id", membership.story_group_id)
      .single();

    if (groupError || !group) return null;

    // 3. Fetch all items in the group
    const { data: rows, error: itemsError } = await supabase
      .from("story_group_items")
      .select("product_id, format_type, sequence_order")
      .eq("story_group_id", group.id)
      .order("sequence_order", { ascending: true });

    if (itemsError || !rows || rows.length === 0) return null;

    // 4. Resolve each item's full data via the media service
    const resolved = await Promise.all(
      rows.map(async (row) => {
        const item = await getMediaById(row.format_type, row.product_id);
        return {
          productId: row.product_id,
          formatType: row.format_type,
          sequenceOrder: row.sequence_order,
          ...item,
        };
      })
    );

    return {
      storyGroupId: group.id,
      title: group.title,
      items: resolved.filter(Boolean),
    };
  } catch (err) {
    console.error("Error fetching story group:", err);
    return null;
  }
}
