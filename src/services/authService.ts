
import { supabase } from "@/integrations/supabase/client";
import { productionConfig, getProductionUrl, isDemoUser } from "@/config/production";
import { useToast } from "@/hooks/use-toast";

export interface AuthError {
  message: string;
  code?: string;
  details?: any;
}

export interface AuthResult {
  success: boolean;
  error?: AuthError;
  requiresConfirmation?: boolean;
}

export class AuthService {
  private static logAuthEvent(event: string, details: any = {}) {
    console.log(`[AUTH] ${event}:`, details);
    
    // In production, send to monitoring service
    if (productionConfig.MONITORING.USER_ANALYTICS) {
      // This would integrate with your monitoring service
      // Example: analytics.track('auth_event', { event, ...details });
    }
  }

  private static async sendWelcomeEmail(userEmail: string, userName: string) {
    try {
      await supabase.functions.invoke('send-email', {
        body: {
          to: userEmail,
          subject: "Welcome to AloraMed!",
          template: productionConfig.EMAIL_TEMPLATES.WELCOME,
          data: { name: userName }
        }
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't throw - email failure shouldn't break auth flow
    }
  }

  static async signUp(
    email: string, 
    password: string, 
    fullName: string,
    role: 'patient' | 'doctor' | 'admin' | 'super_admin' = 'patient'
  ): Promise<AuthResult> {
    try {
      this.logAuthEvent('signup_attempt', { email, role });

      const redirectUrl = `${getProductionUrl()}/auth?confirmed=true`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: role
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        this.logAuthEvent('signup_error', { email, error: error.message });
        return { 
          success: false, 
          error: { message: error.message, code: error.message }
        };
      }

      if (data.user) {
        this.logAuthEvent('signup_success', { 
          email, 
          userId: data.user.id,
          needsConfirmation: !data.session 
        });

        // Send welcome email if auto-confirmed
        if (data.session) {
          await this.sendWelcomeEmail(email, fullName);
        }

        return { 
          success: true, 
          requiresConfirmation: !data.session 
        };
      }

      return { success: false, error: { message: "Unknown signup error" } };
    } catch (error: any) {
      this.logAuthEvent('signup_exception', { email, error: error.message });
      return { 
        success: false, 
        error: { message: "Signup failed. Please try again." } 
      };
    }
  }

  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      this.logAuthEvent('signin_attempt', { email });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        this.logAuthEvent('signin_error', { email, error: error.message });
        return { 
          success: false, 
          error: { message: error.message, code: error.name }
        };
      }

      if (data.user) {
        this.logAuthEvent('signin_success', { 
          email, 
          userId: data.user.id 
        });

        return { success: true };
      }

      return { success: false, error: { message: "Invalid credentials" } };
    } catch (error: any) {
      this.logAuthEvent('signin_exception', { email, error: error.message });
      return { 
        success: false, 
        error: { message: "Sign in failed. Please try again." } 
      };
    }
  }

  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      this.logAuthEvent('password_reset_request', { email });

      const redirectUrl = `${getProductionUrl()}/auth?reset=true`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        this.logAuthEvent('password_reset_error', { email, error: error.message });
        return { 
          success: false, 
          error: { message: error.message } 
        };
      }

      this.logAuthEvent('password_reset_sent', { email });
      return { success: true };
    } catch (error: any) {
      this.logAuthEvent('password_reset_exception', { email, error: error.message });
      return { 
        success: false, 
        error: { message: "Password reset failed. Please try again." } 
      };
    }
  }

  static async signOut(): Promise<AuthResult> {
    try {
      this.logAuthEvent('signout_attempt');

      const { error } = await supabase.auth.signOut();

      if (error) {
        this.logAuthEvent('signout_error', { error: error.message });
        return { 
          success: false, 
          error: { message: error.message } 
        };
      }

      this.logAuthEvent('signout_success');
      return { success: true };
    } catch (error: any) {
      this.logAuthEvent('signout_exception', { error: error.message });
      return { 
        success: false, 
        error: { message: "Sign out failed" } 
      };
    }
  }
}
