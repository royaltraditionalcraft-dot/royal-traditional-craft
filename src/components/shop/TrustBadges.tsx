"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Gem, Hammer } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "Complimentary delivery on all orders over ₹9,999.",
  },
  {
    icon: ShieldCheck,
    title: "5-Year Warranty",
    subtitle: "Quality guaranteed with our extended protection.",
  },
  {
    icon: Gem,
    title: "Premium Materials",
    subtitle: "Sourced from the finest sustainable forests.",
  },
  {
    icon: Hammer,
    title: "Expert Craftsmanship",
    subtitle: "Hand-finished by master artisans with decades of skill.",
  },
];

export function TrustBadges() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#F9FAFB] border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-border shadow-sm flex items-center justify-center mb-4 sm:mb-6 group-hover:border-foreground transition-all duration-500 group-hover:scale-110">
                <badge.icon size={20} className="text-slate-900 sm:hidden" strokeWidth={1.5} />
                <badge.icon size={24} className="text-slate-900 hidden sm:block" strokeWidth={1.5} />
              </div>
              <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-foreground mb-1 sm:mb-2">
                {badge.title}
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-relaxed max-w-[160px] sm:max-w-[200px] hidden sm:block">
                {badge.subtitle}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
