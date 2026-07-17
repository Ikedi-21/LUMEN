import { supabase } from "@/services/supabase/client";

export async function getAdminProducts() {
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.error("Error fetching products:", error.message);
      return [];
    }
    if (!data) return [];
    return data.map((row) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      cover: row.cover,
      description: row.description,
      rating: row.rating,
      releaseDate: row.release_date,
      genres: row.genres || [],
      creator: row.creator,
      source: "admin",
      price: row.price,
    }));
  } catch (err) {
    console.error("Products fetch network error:", err.message);
    return [];
  }
}

export async function addProduct(product) {
  const { data, error } = await supabase.from("products").insert([
    {
      id: product.id,
      type: product.type,
      title: product.title,
      cover: product.cover,
      description: product.description,
      rating: product.rating,
      release_date: product.releaseDate,
      genres: product.genres,
      creator: product.creator,
      price: product.price,
      created_by: product.createdBy,
    },
  ]);
  if (error) throw error;
  return data;
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase.from("products").update(updates).eq("id", id);
  if (error) throw error;
  return data;
}

export async function removeProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
