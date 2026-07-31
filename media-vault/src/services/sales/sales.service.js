import { supabase } from "@/services/supabase/client";

export async function getSalesForCreator(userId) {
  const { data, error } = await supabase
    .from("purchases")
    .select("*, products!inner(created_by), profiles(username)")
    .eq("products.created_by", userId);
    
  if (error) throw error;
  
  return aggregateSales(data || []);
}

export async function getAllSales() {
  const { data, error } = await supabase
    .from("purchases")
    .select("*, products!inner(created_by), profiles(username)");
    
  if (error) throw error;
  
  return aggregateSales(data || []);
}

export async function getSalesForProduct(productId) {
  const { data, error } = await supabase
    .from("purchases")
    .select("*, profiles(username)")
    .eq("product_id", productId)
    .order("purchased_at", { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function getNewSalesCount(userId, lastViewedAt) {
  let query = supabase
    .from("purchases")
    .select("id, products!inner(created_by)", { count: "exact" })
    .eq("products.created_by", userId);
    
  if (lastViewedAt) {
    query = query.gt("purchased_at", lastViewedAt);
  }
  
  const { count, error } = await query;
  if (error) {
    console.error("Error fetching new sales count:", error);
    return 0;
  }
  return count || 0;
}

export async function updateLastViewedSales(userId) {
  const { error } = await supabase
    .from("profiles")
    .update({ last_viewed_sales_at: new Date().toISOString() })
    .eq("id", userId);
    
  if (error) throw error;
}

function aggregateSales(purchases) {
  const grouped = {};
  
  purchases.forEach((p) => {
    if (!grouped[p.product_id]) {
      grouped[p.product_id] = {
        productId: p.product_id,
        title: p.title,
        cover: p.cover,
        type: p.product_type,
        count: 0,
        totalCoinsEarned: 0,
        buyers: []
      };
    }
    grouped[p.product_id].count += 1;
    grouped[p.product_id].totalCoinsEarned += p.coins_spent || 1;
    grouped[p.product_id].buyers.push({
      username: p.profiles?.username || "Unknown",
      date: p.purchased_at
    });
  });
  
  const results = Object.values(grouped);
  results.forEach(r => r.buyers.sort((a, b) => new Date(b.date) - new Date(a.date)));
  return results.sort((a, b) => b.count - a.count);
}
