import { motion } from "framer-motion";
import { ArrowRight, Users, Building2, Heart, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import cateringHero from "@/assets/catering-hero.jpg";
import gallery1 from "@/assets/gallery-1.jpg";

const services = [
  { icon: Building2, title: "Corporate Events", desc: "Impress clients and partners with premium catering for your business meetings and galas." },
  { icon: Users, title: "Private Events", desc: "Celebrate birthdays, anniversaries, and special occasions with a custom menu." },
  { icon: Heart, title: "Weddings", desc: "Make your special day unforgettable with our elegant wedding catering packages." },
  { icon: Briefcase, title: "Business Catering", desc: "Daily office lunches, team events, and working lunches with quality cuisine." },
];

const CateringPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-end overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={cateringHero}
          alt="Catering setup"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-white/70">Catering</p>
            <h1 className="mt-3 font-display text-5xl font-light text-white md:text-7xl">
              Exceptional <span className="italic font-semibold">Events</span>
            </h1>
            <p className="mt-4 max-w-lg text-base text-white/70">
              Bring the FELIZ experience to your event with our premium catering service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:shadow-luxury hover:-translate-y-1"
              >
                <service.icon size={28} className="text-primary" />
                <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{service.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <a
              href="mailto:catering@felizvalencia.com"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-4 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              Request Catering
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CateringPage;
