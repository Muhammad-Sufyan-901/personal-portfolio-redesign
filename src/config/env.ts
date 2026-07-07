/** EmailJS keys from gitignored .env (VITE_EMAILJS_*). All optional — the
 *  contact form degrades gracefully when unset (PLAN v3 externalities). */
export const env = {
  emailjsServiceId: import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined,
  emailjsTemplateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined,
  emailjsPublicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined,
} as const;
