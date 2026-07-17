import { supabase } from "@/services/supabase/client";

/**
 * Uploads an avatar image to Supabase Storage.
 * Uses a fixed filename per user so re-uploads always overwrite the previous one.
 */
export async function uploadAvatar(userId, file) {
  // Use a stable filename (avatar + extension) to avoid accumulating old files
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const filePath = `${userId}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("Avatar upload error:", uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  // Append a cache-busting timestamp so browsers don't show the old cached avatar
  return `${data.publicUrl}?t=${Date.now()}`;
}
