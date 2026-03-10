import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Phone, MapPin, Mail } from "lucide-react";
import Footer from "@/components/Footer";
import EventInquiryForm from "@/components/EventInquiryForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import cateringHero from "@/assets/catering-hero.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { getWhatsAppProposalUrl, getEventCallUrl, EVENT_PHONE_DISPLAY } from "@/lib/notifications";

const MAPS_URL = "https://www.google.com/maps/place/Restaurante+Feliz+Centro/@39.4685146,-0.3836778,19z";

interface CateringDetailLayoutProps {
  titleKey: string;
  heroDescKey: string;
  heroSubKey: string;
  features: { key: string; subKey: string }[];
  packages: { nameKey: string; priceKey: string; itemsKey: string }[];
  steps: { key: string; descKey: string }[];
  cases: { key: string; subKey: string }[];
  accordionItems: { titleKey: string; descKey?: string; listKey: string }[];
  faqItems: { qKey: string; aKey: string }[];
  formRef?: React.RefObject<HTMLDivElement | null>;
}

const CateringDetailLayout = ({
  titleKey,
  heroDescKey,
  heroSubKey,
  features,
  packages,
  steps,
  cases,
  accordionItems,
  faqItems,
  formRef,
}: CateringDetailLayoutProps) => {
  const { t } = useLanguage();

  const scrollToForm = () => {
    formRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative flex min-h-[45vh] items-end overflow-hidden pt-24">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={cateringHero}
          alt={t(titleKey)}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-12 pt-8">
          <Link
            to="/catering"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft size={16} />
            {t("catering.backToCards")}
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6"
          >
            <h1 className="font-display text-4xl font-semibold text-white md:text-5xl lg:text-6xl">
              {t(titleKey)}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/90">{t(heroDescKey)}</p>
            <p className="mt-2 max-w-2xl text-sm text-white/80">{t(heroSubKey)}</p>
          </motion.div>
        </div>
      </section>

      {/* Feature boxes */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card-hover"
              >
                <p className="font-display text-xl font-semibold text-primary">{t(f.key)}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t(f.subKey)}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={scrollToForm}
              className="flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              {t("catering.ctaRequest")}
            </button>
            <a
              href={getWhatsAppProposalUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted"
            >
              <MessageCircle size={16} />
              {t("catering.ctaWhatsApp")}
            </a>
            <a
              href={getEventCallUrl()}
              className="flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted"
            >
              <Phone size={16} />
              {t("catering.ctaCall")}
            </a>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-3xl font-semibold text-foreground">
            {t("catering.packagesTitle")}
          </h2>
          <div className="mt-6 space-y-6">
            {packages.map((p) => (
              <motion.div
                key={p.nameKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card-hover"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl font-semibold text-foreground">
                    {t(p.nameKey)}
                  </h3>
                  <span className="font-display text-lg font-semibold text-primary">
                    {t(p.priceKey)}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{t(p.itemsKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion - Detalle completo */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
            {t("catering.detailTitle")}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">{t("catering.detailIntro")}</p>
          <Accordion type="single" collapsible className="space-y-2">
            {accordionItems.map((item, i) => (
              <AccordionItem
                key={item.titleKey}
                value={`item-${i}`}
                className="rounded-2xl border border-border bg-card px-6 shadow-card-hover"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <span className="font-display text-lg font-semibold text-foreground text-left">
                    {t(item.titleKey)}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  {item.descKey && (
                    <p className="text-sm text-muted-foreground mb-3">{t(item.descKey)}</p>
                  )}
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{t(item.listKey)}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 4 Steps */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-3xl font-semibold text-foreground">
            {t("catering.stepsTitle")}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-card-hover"
              >
                <p className="font-display text-lg font-semibold text-foreground">
                  {i + 1}. {t(s.key)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{t(s.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-3xl font-semibold text-foreground">
            {t("catering.resultsTitle")}
          </h2>
          <div className="mt-6 space-y-4">
            {cases.map((c) => (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-secondary/60 p-6"
              >
                <p className="font-display text-lg font-semibold text-foreground">{t(c.key)}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t(c.subKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card p-8 shadow-card-hover"
          >
            <h3 className="font-display text-2xl font-semibold text-foreground">
              {t("catering.ctaTitle")}
            </h3>
            <p className="mt-2 text-muted-foreground">{t("catering.ctaDesc")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToForm}
                className="flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-lg hover:scale-[1.02]"
              >
                {t("catering.ctaRequest")}
              </button>
              <a
                href={getWhatsAppProposalUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted"
              >
                <MessageCircle size={16} />
                {t("catering.ctaWhatsApp")}
              </a>
              <a
                href={getEventCallUrl()}
                className="flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted"
              >
                <Phone size={16} />
                {t("catering.ctaCall")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Event inquiry form */}
      <section ref={formRef} className="py-12 scroll-mt-24">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card p-8 shadow-card-hover"
          >
            <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
              {t("cateringForm.formTitle")}
            </h3>
            <EventInquiryForm />
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-3xl font-semibold text-foreground">
            {t("catering.faqTitle")}
          </h2>
          <div className="mt-6 space-y-4">
            {faqItems.map((faq) => (
              <div
                key={faq.qKey}
                className="rounded-2xl border border-border bg-card p-6 shadow-card-hover"
              >
                <p className="font-display text-lg font-semibold text-foreground">{t(faq.qKey)}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t(faq.aKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto directo */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-3xl font-semibold text-foreground">
            {t("catering.contactTitle")}
          </h2>
          <p className="mt-2 text-muted-foreground">{t("catering.contactDesc")}</p>
          <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card-hover">
            <p className="flex items-center gap-2 text-foreground">
              <MapPin size={18} className="text-primary" />
              {t("footer.address")}
            </p>
            <a
              href={getWhatsAppProposalUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground hover:text-primary"
            >
              <MessageCircle size={18} className="text-primary" />
              {EVENT_PHONE_DISPLAY}
            </a>
            <a
              href={getEventCallUrl()}
              className="flex items-center gap-2 text-foreground hover:text-primary"
            >
              <Phone size={18} className="text-primary" />
              {EVENT_PHONE_DISPLAY}
            </a>
            <a
              href="mailto:sergej.zhyrik96@gmail.com"
              className="flex items-center gap-2 text-foreground hover:text-primary"
            >
              <Mail size={18} className="text-primary" />
              sergej.zhyrik96@gmail.com
            </a>
            <p className="text-sm text-muted-foreground">{t("catering.coverage")}</p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted"
            >
              <MapPin size={16} />
              {t("catering.viewLocation")}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CateringDetailLayout;
