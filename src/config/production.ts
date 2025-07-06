
/**
 * Production configuration for AloraMed
 * Handles environment-specific settings for staging and production
 */

export const productionConfig = {
  // Production URLs - update these with your actual domains
  PRODUCTION_DOMAIN: "https://aloramedapp.com",
  STAGING_DOMAIN: "https://staging.aloramedapp.com",
  
  // Email configuration
  EMAIL_TEMPLATES: {
    WELCOME: "welcome",
    EMAIL_CONFIRMATION: "email_confirmation", 
    PASSWORD_RESET: "password_reset",
    APPOINTMENT_REMINDER: "appointment_reminder",
    CLINIC_INVITATION: "clinic_invitation"
  },

  // Monitoring and analytics
  MONITORING: {
    ERROR_TRACKING: true,
    PERFORMANCE_MONITORING: true,
    USER_ANALYTICS: true
  },

  // Security settings
  SECURITY: {
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    RATE_LIMITING: true,
    CORS_ORIGINS: [
      "https://aloramedapp.com",
      "https://staging.aloramedapp.com",
      "https://www.aloramedapp.com"
    ]
  },

  // Demo mode configuration
  DEMO_MODE: {
    ENABLED: true,
    WARNING_MESSAGE: "You are using demo credentials. For production use, please create a real account.",
    LIMITATIONS: {
      READ_ONLY_CERTAIN_FEATURES: true,
      LIMITED_DATA_ACCESS: true
    }
  }
};

export const getProductionUrl = () => {
  const environment = localStorage.getItem('env') || 'production';
  return environment === 'staging' 
    ? productionConfig.STAGING_DOMAIN 
    : productionConfig.PRODUCTION_DOMAIN;
};

export const isDemoUser = (userId: string) => {
  return userId.startsWith('mock-');
};
