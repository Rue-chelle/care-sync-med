
/**
 * Environment configuration helper for switching between staging and production
 * 
 * Usage:
 *   import { envConfig } from "@/config/env";
 *   const { SUPABASE_URL, SUPABASE_ANON_KEY, ENVIRONMENT } = envConfig;
 * 
 * By default, checks localStorage for "env" ('production' or 'staging').
 * You can change the environment with:
 *   localStorage.setItem('env', 'staging');
 *   window.location.reload();
 */

type EnvOptions = "production" | "staging";

// !!! Replace these with your actual SUPABASE staging project values !!!
const STAGING_SUPABASE_URL = "https://YOUR-STAGING-PROJECT.supabase.co";
const STAGING_SUPABASE_ANON_KEY = "YOUR-STAGING-ANON-KEY";

// These should match your current (prod) config:
const PROD_SUPABASE_URL = "https://aibrsdzjvlejirlyfkzo.supabase.co";
const PROD_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpYnJzZHpqdmxlamlybHlma3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDIwODksImV4cCI6MjA2MzU3ODA4OX0.5QP-KG0bzvooFmOjtmnmBGXjRKH-vorBAMLL-Y3B_eY";

function getActiveEnv(): EnvOptions {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("env");
    if (stored === "staging" || stored === "production") return stored;
  }
  // fallback: default to production
  return "production";
}

export const envConfig = (() => {
  const ENVIRONMENT: EnvOptions = getActiveEnv();
  if (ENVIRONMENT === "staging") {
    return {
      ENVIRONMENT,
      SUPABASE_URL: STAGING_SUPABASE_URL,
      SUPABASE_ANON_KEY: STAGING_SUPABASE_ANON_KEY,
    };
  }
  return {
    ENVIRONMENT,
    SUPABASE_URL: PROD_SUPABASE_URL,
    SUPABASE_ANON_KEY: PROD_SUPABASE_ANON_KEY,
  };
})();
