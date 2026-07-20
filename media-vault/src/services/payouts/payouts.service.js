import { supabase } from "@/services/supabase/client";
import { getUserCoins, spendCoins } from "@/services/coins/coins.service";

export async function createPayoutRequest(userId, coinsRequested) {
  const currentCoins = await getUserCoins(userId);
  if (currentCoins < coinsRequested) {
    throw new Error("Insufficient coins for this payout request.");
  }

  const { data, error } = await supabase
    .from("payout_requests")
    .insert({
      user_id: userId,
      coins_requested: coinsRequested,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserPayoutRequests(userId) {
  const { data, error } = await supabase
    .from("payout_requests")
    .select("*")
    .eq("user_id", userId)
    .order("requested_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAllPayoutRequests() {
  const { data, error } = await supabase
    .from("payout_requests")
    .select("*")
    .order("requested_at", { ascending: false });

  if (error) throw error;

  if (!data || data.length === 0) return [];

  const userIds = [...new Set(data.map(r => r.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, email")
    .in("id", userIds);

  const profileMap = {};
  (profiles || []).forEach(p => { profileMap[p.id] = p; });

  return data.map(req => ({
    ...req,
    profiles: profileMap[req.user_id] || null,
  }));
}

export async function reviewPayoutRequest(requestId, status, reviewerId) {
  const { data: request, error: fetchError } = await supabase
    .from("payout_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (fetchError) throw fetchError;
  if (request.status !== "pending") {
    throw new Error("This payout request has already been reviewed.");
  }

  if (status === "approved") {
    await spendCoins(request.user_id, request.coins_requested);
  }

  const { data, error: updateError } = await supabase
    .from("payout_requests")
    .update({
      status,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .select()
    .single();

  if (updateError) throw updateError;
  return data;
}
