/** Typed EmailJS env access — keys live in `.env` (gitignored). */
export const emailjsConfig: {
  serviceId: string;
  templateId: string;
  publicKey: string;
} = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};
