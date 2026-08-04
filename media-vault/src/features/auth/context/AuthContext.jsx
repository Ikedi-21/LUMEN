/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/services/supabase/client";

const AuthContext = createContext();

// provides user session, profile data, and auth actions to the whole app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetches the public profile row for the logged-in user
  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (!error) setProfile(data);
  }

  useEffect(() => {
    // restore session on page load so the user stays logged in after a refresh
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) loadProfile(session.user.id);
      setLoading(false);
    });

    // keep user state in sync with Supabase (handles tab-switch, token refresh, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signUp(email, password, username) {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { username }
      }
    });
    if (error) throw error;
    return data;
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();
      
    // block suspended or banned accounts from logging in
    if (profileData && profileData.status !== "active") {
      await supabase.auth.signOut();
      throw new Error(`Account is ${profileData.status}. Please contact support.`);
    }
    
    return data;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  // re-fetches the profile, useful after the user updates their settings
  async function refreshProfile() {
    if (user) {
      await loadProfile(user.id);
    }
  }

  const value = { user, profile, loading, signUp, signIn, signOut, refreshProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
