"use client";

import { motion } from "framer-motion";
import { CircleAlert, CircleCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { sectionIds } from "@/constants/routes";
import { newsletterSchema } from "@/utils/validation";
import { useLanguage } from "@/i18n/LanguageProvider";
import { messages } from "@/i18n/messages";

export function CTASection() {
  const { locale } = useLanguage();
  const copy = messages[locale].cta;
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = newsletterSchema.safeParse({ email });
    if (!result.success) {
      setError(copy.invalidEmail);
      setSubmitted(false);
      return;
    }

    // TODO: wire up to services/api/newsletter once the backend exists.
    setError(null);
    setSubmitted(true);
    setEmail("");
  }

  return (
    <Section id={sectionIds.cta} ariaLabel={copy.ariaLabel} className="bg-coffee-brown">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer}
          className="mx-auto max-w-[36rem] text-center"
        >
          <motion.h2 variants={fadeUp} className="font-heading text-3xl text-cream sm:text-4xl">
            {copy.heading}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-sm text-cream/85">
            {copy.description}
          </motion.p>

          <motion.form
            variants={fadeUp}
            onSubmit={handleSubmit}
            noValidate
            className="mt-lg flex flex-col gap-sm sm:flex-row sm:justify-center"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              {copy.emailLabel}
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={copy.placeholder}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "newsletter-error" : undefined}
              dir="ltr"
              className="min-h-11 w-full min-w-0 rounded-full bg-cream px-md py-sm text-coffee-dark placeholder:text-coffee-dark/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-premium-gold sm:w-80"
            />
            <Button type="submit" className="w-full shrink-0 sm:w-auto">
              {copy.submit}
            </Button>
          </motion.form>

          <div role="status" aria-live="polite" className="mt-sm min-h-6 text-sm text-cream">
            {error && (
              <p id="newsletter-error" className="flex items-center justify-center gap-xs">
                <CircleAlert className="size-4" aria-hidden="true" />
                {error}
              </p>
            )}
            {submitted && (
              <p className="flex items-center justify-center gap-xs">
                <CircleCheck className="size-4" aria-hidden="true" />
                {copy.success}
              </p>
            )}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
