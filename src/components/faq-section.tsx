"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { FAQCopy } from "../lib/translations";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection({ copy }: { copy: FAQCopy }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative min-h-screen bg-background py-32 overflow-hidden">
      <div className="relative max-w-3xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-muted-foreground text-sm tracking-widest uppercase mb-4">
            {copy.eyebrow}
          </p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-tight text-foreground">
            {copy.title}
          </h2>
        </motion.div>

        {/* FAQ items */}
        <div className="space-y-4">
          {copy.items.map((item, index) => (
            <FAQAccordionItem
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQAccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className="group"
    >
      <div
        className={`border rounded-xl transition-colors ${
          isOpen
            ? "border-accent/30 bg-card/50"
            : "border-border/50 bg-transparent hover:border-border hover:bg-card/30"
        }`}
      >
        <button
          aria-controls={`faq-answer-${index}`}
          aria-expanded={isOpen}
          onClick={onToggle}
          className="w-full flex items-center justify-between p-6 text-left"
        >
          <span className={`text-base font-medium transition-colors ${
            isOpen ? "text-foreground" : "text-foreground/80"
          }`}>
            {item.question}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={`shrink-0 ml-4 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
              isOpen ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
            }`}
          >
            {isOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          </motion.div>
        </button>

        <motion.div
          id={`faq-answer-${index}`}
          aria-hidden={!isOpen}
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 pt-0">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {item.answer}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
