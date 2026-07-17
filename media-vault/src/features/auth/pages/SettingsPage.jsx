import { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { updateProfile } from "@/services/profiles";
import { uploadAvatar } from "@/services/storage";
import { useToast } from "@/shared/ui";
import "./SettingsPage.css";

export default function SettingsPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const { addToast } = useToast();
  
  const [username, setUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
    }
  }, [profile]);

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
  if (!user || !profile) return <Navigate to="/login" replace />;

  async function handleSave(e) {
    e.preventDefault();
    if (!username.trim()) {
      addToast("Username cannot be empty", "error");
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await updateProfile(user.id, { username: username.trim() });
      if (res.success) {
        await refreshProfile();
        addToast("Username updated successfully!", "success");
      } else {
        addToast(res.error || "Failed to update username", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("An error occurred while saving.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadAvatar(user.id, file);
      const res = await updateProfile(user.id, { avatar_url: url });
      
      if (res.success) {
        await refreshProfile();
        addToast("Avatar updated successfully!", "success");
      } else {
        addToast(res.error || "Failed to update avatar", "error");
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      let msg = err?.message || err?.error_description || "Unknown error";
      if (msg.toLowerCase().includes("bucket not found")) {
        msg = "The 'avatars' storage bucket was not found. Please log into your Supabase Dashboard, create a new public bucket named 'avatars', and configure RLS policies for uploads.";
      }
      addToast(`Failed to upload avatar: ${msg}`, "error");
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const displayInitials = (profile.username || profile.email || "?").charAt(0).toUpperCase();

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>Account Settings</h1>
        
        <div className="settings-section avatar-section">
          <h2>Profile Picture</h2>
          <div className="avatar-wrapper">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="User Avatar" className="settings-avatar-img" />
            ) : (
              <div className="settings-avatar-placeholder">
                {displayInitials}
              </div>
            )}
            <div className="avatar-actions">
              <button 
                type="button" 
                className="btn-outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload New Picture"}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept="image/*" 
                style={{ display: "none" }} 
              />
              <p className="help-text">Recommended: Square image, at least 256x256px.</p>
            </div>
          </div>
        </div>

        <hr className="settings-divider" />

        <div className="settings-section">
          <h2>Profile Details</h2>
          <form onSubmit={handleSave} className="settings-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input 
                id="username"
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="form-input"
                placeholder="Your username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                id="email"
                type="email" 
                value={profile.email || user.email} 
                disabled 
                className="form-input disabled-input"
              />
              <span className="help-text">Email address cannot be changed.</span>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSaving || username === profile.username}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
