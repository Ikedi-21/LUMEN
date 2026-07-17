import { supabase } from "@/services/supabase/client";
import { addCoins } from "@/services/coins/coins.service";

export async function hasPurchased(userId, productId) {
  const { data, error } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();
    
  if (error) throw error;
  return !!data;
}

export async function createPurchase(userId, product, coinsSpent) {
  const { error } = await supabase
    .from("purchases")
    .insert({
      user_id: userId,
      product_id: product.id,
      product_type: product.type || product.product_type,
      title: product.title || product.name,
      cover: product.cover || product.image_url || product.poster_path || product.thumbnail,
      coins_spent: coinsSpent,
    });
    
  if (error) throw error;

  // Look up if this product was manually added by staff
  try {
    const { data: dbProduct } = await supabase
      .from("products")
      .select("created_by")
      .eq("id", product.id)
      .maybeSingle();

    if (dbProduct && dbProduct.created_by) {
      await addCoins(dbProduct.created_by, coinsSpent);
    }
  } catch (err) {
    console.error("Failed to add creator earnings:", err);
  }
}

export async function getUserPurchases(userId) {
  const { data, error } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", userId)
    .order("purchased_at", { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function removePurchase(userId, productId) {
  const { error } = await supabase
    .from("purchases")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
    
  if (error) throw error;
}

