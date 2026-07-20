import { supabase } from "@/services/supabase/client";

export async function getReviews(productId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(username, avatar_url)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching reviews:", error.message);
    return [];
  }
  return data || [];
}

export async function getUserReview(userId, productId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();
  if (error) {
    console.error("Error fetching user review:", error.message);
    return null;
  }
  return data;
}

export async function upsertReview(userId, productType, productId, rating, comment) {
  const { data, error } = await supabase
    .from("reviews")
    .upsert(
      {
        user_id: userId,
        product_type: productType,
        product_id: productId,
        rating,
        comment,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,product_id" }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteReview(userId, productId) {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
  if (error) throw error;
}

export function getAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return null;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
}
