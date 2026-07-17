import { supabase } from "@/services/supabase/client";

export async function getProfile(userId) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
      
    if (error) {
      console.error("Error fetching profile:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Failed to fetch profile:", err);
    return null;
  }
}

export async function updateProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating profile:", error.message);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error("Failed to update profile:", err);
    return { success: false, error: err.message };
  }
}

export async function getAllProfiles() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching profiles:", error.message);
      return [];
    }
    
    if (!data) return [];
    
    return data;
  } catch (err) {
    console.error("Failed to fetch profiles:", err);
    return [];
  }
}

export async function updateProfileStatus(userId, status) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ status })
      .eq("id", userId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating profile status:", error.message);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error("Failed to update profile status:", err);
    return { success: false, error: err.message };
  }
}

export async function updateProfileRole(userId, role) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating profile role:", error.message);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error("Failed to update profile role:", err);
    return { success: false, error: err.message };
  }
}
