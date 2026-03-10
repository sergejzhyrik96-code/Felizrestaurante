import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRef } from "react";

const TEAM_IMAGES_BASE = "/images/you-story";
const TEAM_IMAGES = [
  "Transform_this_photo_into_a_warm_cinematic_restaur_delpmaspu.png",
  "Transform_this_photo_into_a_warm_cinematic_restaur_delpmaspu%20(1).png",
  "Transform_this_photo_into_a_warm_cinematic_restaur_delpmaspu%20(2).png",
  "Transform_this_photo_into_a_warm_cinematic_restaur_delpmaspu%20(3).png",
  "Transform_this_photo_into_a_warm_cinematic_restaur_delpmaspu%20(4).png",
  "Transform_this_photo_into_a_warm_cinematic_restaur_delpmaspu%20(5).png",
];

const imgBase =
  "w-full h-full rounded-2xl shadow-luxury object-cover object-top transition-[transform] duration-350 ease-out";

const AboutSection = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const centerY = useTransform(scrollYProgress, [0, 0.25], [8, -4]);
  const leftY = useTransform(scrollYProgress, [0, 0.25], [18, -10]);
  const rightY = useTransform(scrollYProgress, [0, 0.25], [18, -10]);
  const topY = useTransform(scrollYProgress, [0, 0.25], [14, -7]);
  const bottomY = useTransform(scrollYProgress, [0, 0.25], [14, -7]);

  const stagger = { opacity: 0, y: 28 };
  const staggerIn = { opacity: 1, y: 0 };
  const transition = { duration: 0.6, ease: "easeOut" };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-secondary py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left column: Team title + photo composition */}
          <div className="relative">
            {/* Section title above photos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h3 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
                {t("story.teamTitle")}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                {t("story.teamSubtitle")}
              </p>
            </motion.div>

            {/* Mobile: vertical stack, no overlap */}
            <div className="flex flex-col gap-6 lg:hidden">
              {TEAM_IMAGES.map((file, i) => (
                <motion.div
                  key={file}
                  initial={stagger}
                  whileInView={staggerIn}
                  viewport={{ once: true }}
                  transition={{ ...transition, delay: i * 0.06 }}
                  className="overflow-hidden rounded-2xl shadow-luxury"
                >
                  <img
                    src={`${TEAM_IMAGES_BASE}/${file}`}
                    alt={t("story.teamImageAlt")}
                    loading="lazy"
                    className={`${imgBase} aspect-[3/4] hover:scale-[1.04]`}
                  />
                </motion.div>
              ))}
            </div>

            {/* Desktop: staggered editorial layout with parallax */}
            <motion.div
              ref={galleryRef}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={transition}
              className="relative hidden min-h-[480px] lg:block"
            >
              {/* Top center - small */}
              <motion.div
                style={{ y: topY }}
                initial={stagger}
                whileInView={staggerIn}
                viewport={{ once: true }}
                transition={{ ...transition, delay: 0.05 }}
                className="absolute left-1/2 top-0 z-10 w-[28%] -translate-x-1/2"
              >
                <img
                  src={`${TEAM_IMAGES_BASE}/${TEAM_IMAGES[1]}`}
                  alt={t("story.teamImageAlt")}
                  loading="lazy"
                  className={`${imgBase} aspect-[3/4] hover:scale-[1.04]`}
                />
              </motion.div>

              {/* Left - small */}
              <motion.div
                style={{ y: leftY }}
                initial={stagger}
                whileInView={staggerIn}
                viewport={{ once: true }}
                transition={{ ...transition, delay: 0.1 }}
                className="absolute left-0 top-[30%] z-10 w-[30%]"
              >
                <img
                  src={`${TEAM_IMAGES_BASE}/${TEAM_IMAGES[2]}`}
                  alt={t("story.teamImageAlt")}
                  loading="lazy"
                  className={`${imgBase} aspect-[3/4] hover:scale-[1.04]`}
                />
              </motion.div>

              {/* Center - LARGE */}
              <motion.div
                style={{ y: centerY }}
                initial={stagger}
                whileInView={staggerIn}
                viewport={{ once: true }}
                transition={{ ...transition, delay: 0.15 }}
                className="absolute left-1/2 top-1/2 z-20 w-[52%] -translate-x-1/2 -translate-y-1/2"
              >
                <img
                  src={`${TEAM_IMAGES_BASE}/${TEAM_IMAGES[0]}`}
                  alt={t("story.teamImageAlt")}
                  loading="lazy"
                  className={`${imgBase} aspect-[3/4] hover:scale-[1.04]`}
                />
              </motion.div>

              {/* Right - small */}
              <motion.div
                style={{ y: rightY }}
                initial={stagger}
                whileInView={staggerIn}
                viewport={{ once: true }}
                transition={{ ...transition, delay: 0.2 }}
                className="absolute right-0 top-[30%] z-10 w-[30%]"
              >
                <img
                  src={`${TEAM_IMAGES_BASE}/${TEAM_IMAGES[3]}`}
                  alt={t("story.teamImageAlt")}
                  loading="lazy"
                  className={`${imgBase} aspect-[3/4] hover:scale-[1.04]`}
                />
              </motion.div>

              {/* Bottom center - small */}
              <motion.div
                style={{ y: bottomY }}
                initial={stagger}
                whileInView={staggerIn}
                viewport={{ once: true }}
                transition={{ ...transition, delay: 0.25 }}
                className="absolute bottom-0 left-1/2 z-10 w-[28%] -translate-x-1/2"
              >
                <img
                  src={`${TEAM_IMAGES_BASE}/${TEAM_IMAGES[4]}`}
                  alt={t("story.teamImageAlt")}
                  loading="lazy"
                  className={`${imgBase} aspect-[3/4] hover:scale-[1.04]`}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Right column: Story text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary">
              {t("story.subtitle")}
            </p>
            <h2 className="mt-3 font-display text-4xl font-light text-foreground md:text-5xl">
              {t("story.title")}
            </h2>
            <p className="mt-2 font-display text-xl font-light italic text-muted-foreground">
              {t("story.tagline")}
            </p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>{t("story.paragraph1")}</p>
              <p>{t("story.paragraph2")}</p>
              <p>{t("story.paragraph3")}</p>
              <p>{t("story.paragraph4")}</p>
              <p>{t("story.paragraph5")}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
