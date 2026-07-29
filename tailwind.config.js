/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "surface-container-high": "var(--color-surface-container-high)",
        "on-error": "var(--color-on-error)",
        "surface-variant": "var(--color-surface-variant)",
        "on-tertiary-container": "var(--color-on-tertiary-container)",
        "surface-dim": "var(--color-surface-dim)",
        "primary-fixed-dim": "var(--color-primary-fixed-dim)",
        "primary": "var(--color-primary)",
        "surface-tint": "var(--color-surface-tint)",
        "on-error-container": "var(--color-on-error-container)",
        "on-surface": "var(--color-on-surface)",
        "outline": "var(--color-outline)",
        "on-tertiary-fixed": "var(--color-on-tertiary-fixed)",
        "tertiary-container": "var(--color-tertiary-container)",
        "secondary-fixed": "var(--color-secondary-fixed)",
        "error-container": "var(--color-error-container)",
        "inverse-surface": "var(--color-inverse-surface)",
        "on-background": "var(--color-on-background)",
        "surface": "var(--color-surface)",
        "on-surface-variant": "var(--color-on-surface-variant)",
        "surface-container-highest": "var(--color-surface-container-highest)",
        "tertiary-fixed": "var(--color-tertiary-fixed)",
        "on-secondary": "var(--color-on-secondary)",
        "inverse-primary": "var(--color-inverse-primary)",
        "surface-container-low": "var(--color-surface-container-low)",
        "on-primary": "var(--color-on-primary)",
        "on-primary-container": "var(--color-on-primary-container)",
        "inverse-on-surface": "var(--color-inverse-on-surface)",
        "background": "var(--color-background)",
        "on-secondary-container": "var(--color-on-secondary-container)",
        "secondary-fixed-dim": "var(--color-secondary-fixed-dim)",
        "surface-container-lowest": "var(--color-surface-container-lowest)",
        "on-tertiary-fixed-variant": "var(--color-on-tertiary-fixed-variant)",
        "on-secondary-fixed-variant": "var(--color-on-secondary-fixed-variant)",
        "primary-container": "var(--color-primary-container)",
        "secondary-container": "var(--color-secondary-container)",
        "surface-container": "var(--color-surface-container)",
        "tertiary": "var(--color-tertiary)",
        "tertiary-fixed-dim": "var(--color-tertiary-fixed-dim)",
        "on-tertiary": "var(--color-on-tertiary)",
        "on-primary-fixed": "var(--color-on-primary-fixed)",
        "surface-bright": "var(--color-surface-bright)",
        "secondary": "var(--color-secondary)",
        "on-secondary-fixed": "var(--color-on-secondary-fixed)",
        "primary-fixed": "var(--color-primary-fixed)",
        "outline-variant": "var(--color-outline-variant)",
        "error": "var(--color-error)",
        "on-primary-fixed-variant": "var(--color-on-primary-fixed-variant)"
      },
      "borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "spacing": {
        "container-padding-mobile": "16px",
        "gutter": "24px",
        "container-padding-desktop": "40px",
        "glass-padding": "24px",
        "base": "8px"
      },
      "fontFamily": {
        "body-md": ["Inter"],
        "label-caps": ["Inter"],
        "display-lg": ["Inter"],
        "headline-md": ["Inter"],
        "display-lg-mobile": ["Inter"],
        "body-lg": ["Inter"]
      },
      "fontSize": {
        "body-md": [
          "16px",
          {
            "lineHeight": "24px",
            "fontWeight": "400"
          }
        ],
        "label-caps": [
          "12px",
          {
            "lineHeight": "16px",
            "letterSpacing": "0.05em",
            "fontWeight": "700"
          }
        ],
        "display-lg": [
          "48px",
          {
            "lineHeight": "56px",
            "letterSpacing": "-0.02em",
            "fontWeight": "700"
          }
        ],
        "headline-md": [
          "24px",
          {
            "lineHeight": "32px",
            "letterSpacing": "-0.01em",
            "fontWeight": "600"
          }
        ],
        "display-lg-mobile": [
          "32px",
          {
            "lineHeight": "40px",
            "letterSpacing": "-0.02em",
            "fontWeight": "700"
          }
        ],
        "body-lg": [
          "18px",
          {
            "lineHeight": "28px",
            "fontWeight": "400"
          }
        ]
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      },
      animation: {
        gradient: 'gradient 15s ease infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
