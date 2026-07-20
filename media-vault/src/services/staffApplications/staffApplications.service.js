import { supabase } from "@/services/supabase/client";
import { updateProfileRole } from "@/services/profiles";

export async function submitApplication(userId, reason) {
  const { data: existing } = await supabase
    .from("staff_applications")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "pending")
    .limit(1)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "You already have a pending application." };
  }

  const { error } = await supabase
    .from("staff_applications")
    .insert([{ user_id: userId, reason }]);

  if (error) {
    console.error("Failed to submit application:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getApplicationForUser(userId) {
  const { data, error } = await supabase
    .from("staff_applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch application:", error.message);
    return null;
  }

  return data;
}

export async function getAllApplications() {
  const { data, error } = await supabase
    .from("staff_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch applications:", error.message);
    return [];
  }

  if (!data || data.length === 0) return [];

  const userIds = [...new Set(data.map(a => a.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, email")
    .in("id", userIds);

  const profileMap = {};
  (profiles || []).forEach(p => { profileMap[p.id] = p; });

  return data.map(app => ({
    ...app,
    profiles: profileMap[app.user_id] || null,
  }));
}

export async function reviewApplication(appId, status, reviewerId, targetUserId) {
  const { error } = await supabase
    .from("staff_applications")
    .update({ status, reviewed_by: reviewerId, reviewed_at: new Date().toISOString() })
    .eq("id", appId);

  if (error) {
    console.error("Failed to review application:", error.message);
    return { success: false, error: error.message };
  }

  if (status === "approved" && targetUserId) {
    const { success } = await updateProfileRole(targetUserId, "staff");
    if (!success) {
      console.warn("Application approved but failed to auto-promote user to staff.");
    }
  }

  return { success: true };
}
