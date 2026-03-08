import { motion } from "framer-motion";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";

const AboutSection = () => {
  return (
    <section className="relative overflow-hidden bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              <img
                src={gallery1}
                alt="FELIZ restaurant terrace"
                className="w-full rounded-2xl shadow-luxury object-cover aspect-[4/3]"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -bottom-8 -right-4 w-48 md:w-64"
              >
                <img
                  src={gallery2}
                  alt="Chef plating dish"
                  className="rounded-2xl shadow-luxury object-cover aspect-square border-4 border-background"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary">Our Story</p>
            <h2 className="mt-3 font-display text-4xl font-light text-foreground md:text-5xl">
              Passion for <span className="italic font-semibold">Mediterranean</span> Cuisine
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Born in the vibrant heart of Valencia, FELIZ brings together the finest 
              Mediterranean traditions with a modern creative twist. Our chef sources 
              the freshest local ingredients from the Mercado Central and the coast 
              to craft unforgettable dining experiences.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              From our signature Paella Valenciana to hand-carved Iberian ham, every 
              dish tells a story of passion, tradition, and innovation.
            </p>

            <div className="mt-10 flex gap-12">
              {[
                { value: "4.8", label: "Rating" },
                { value: "340+", label: "Reviews" },
                { value: "2019", label: "Founded" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-semibold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
