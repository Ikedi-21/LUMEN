import { supabase } from "@/services/supabase/client";

export async function getWishlistItems(userId) {
  const { data, error } = await supabase.from("wishlist_items").select("*").eq("user_id", userId);
  if (error) throw error;
  return data;
}

export async function addToWishlist(userId, productId, productType) {
  const { error } = await supabase
    .from("wishlist_items")
    .upsert({ user_id: userId, product_id: productId, product_type: productType });
  if (error) throw error;
}

export async function removeFromWishlist(userId, productId) {
  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
  if (error) throw error;
}
