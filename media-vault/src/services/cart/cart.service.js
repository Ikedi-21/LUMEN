import { supabase } from "@/services/supabase/client";

export async function getCartItems(userId) {
  const { data, error } = await supabase.from("cart_items").select("*").eq("user_id", userId);
  if (error) throw error;
  return data;
}

export async function addToCart(userId, productId, productType) {
  // Check if the item is already in the cart
  const { data: existing, error: selectError } = await supabase
    .from("cart_items")
    .select("quantity")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (selectError) throw selectError;

  if (existing) {
    // If present, increment quantity
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: (existing.quantity || 1) + 1 })
      .eq("user_id", userId)
      .eq("product_id", productId);
    if (updateError) throw updateError;
  } else {
    // If new, insert row with quantity 1
    const { error: insertError } = await supabase
      .from("cart_items")
      .insert({ user_id: userId, product_id: productId, product_type: productType, quantity: 1 });
    if (insertError) throw insertError;
  }
}

export async function updateCartQuantity(userId, productId, quantity) {
  if (quantity <= 0) {
    return removeFromCart(userId, productId);
  }
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("user_id", userId)
    .eq("product_id", productId);
  if (error) throw error;
}

export async function removeFromCart(userId, productId) {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
  if (error) throw error;
}

