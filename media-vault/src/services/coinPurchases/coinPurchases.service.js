import { supabase } from "@/services/supabase/client";

export async function createPendingCoinPurchase(userId, coinsRequested, nairaAmount) {
  const { data, error } = await supabase
    .from("coin_purchases")
    .insert({
      user_id: userId,
      coins_requested: coinsRequested,
      naira_amount: nairaAmount,
      status: "pending"
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function markCoinPurchasePaid(purchaseId, reference) {
  const { error } = await supabase
    .from("coin_purchases")
    .update({
      status: "paid",
      paystack_reference: reference
    })
    .eq("id", purchaseId);

  if (error) throw error;
}

export async function getCoinPurchaseHistory(userId) {
  const { data, error } = await supabase
    .from("coin_purchases")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}
