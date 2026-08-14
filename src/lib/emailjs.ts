import emailjs from "@emailjs/browser";
import { env } from "@/config/env";

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

/** All three VITE_EMAILJS_* keys present (build-time). The contact form
 *  renders only when true; channels-only degradation is the default path
 *  (PLAN v3 externalities — keys live in gitignored .env). */
export const emailEnabled = Boolean(env.emailjsServiceId && env.emailjsTemplateId && env.emailjsPublicKey);

/** Thin @emailjs/browser send wrapper — throws on failure; the caller owns
 *  all UI state. No HTTP layer beyond this (repo rule: static + EmailJS). */
export async function sendContactEmail(values: ContactFormValues): Promise<void> {
  const { emailjsServiceId, emailjsTemplateId, emailjsPublicKey } = env;
  if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
    throw new Error("EmailJS is not configured");
  }
  await emailjs.send(emailjsServiceId, emailjsTemplateId, { ...values }, { publicKey: emailjsPublicKey });
}
