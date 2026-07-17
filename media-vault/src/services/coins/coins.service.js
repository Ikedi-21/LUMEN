import { supabase } from "@/services/supabase/client";

export async function getUserCoins(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("coins")
    .eq("id", userId)
    .single();
    
  if (error) throw error;
  return data?.coins || 0;
}

export async function spendCoins(userId, amount) {
  const { data, error } = await supabase
    .from("profiles")
    .select("coins")
    .eq("id", userId)
    .single();
  
  if (error) throw error;
  
  const currentCoins = Number(data.coins || 0);
  const spendAmount = Number(amount) || 0;
  
  if (currentCoins < spendAmount) {
    throw new Error("Insufficient coins");
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ coins: currentCoins - spendAmount })
    .eq("id", userId)
    .select()
    .single();

  if (updateError) throw updateError;
}

export async function addCoins(userId, amount) {
  const { data, error } = await supabase
    .from("profiles")
    .select("coins")
    .eq("id", userId)
    .single();
    
  if (error) throw error;
  
  const currentCoins = Number(data.coins || 0);
  const addAmount = Number(amount) || 0;
  
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ coins: currentCoins + addAmount })
    .eq("id", userId)
    .select()
    .single();

  if (updateError) throw updateError;
}
