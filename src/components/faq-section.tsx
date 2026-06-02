"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How is ScreenCam different from browser-based recorders?",
    answer: "ScreenCam is built for macOS as a native recording and editing app. The goal is a compact Mac-first workflow with local capture, smooth editing controls, and preview-accurate export.",
  },
  {
    question: "What's the minimum macOS version required?",
    answer: "ScreenCam requires macOS 15 or later.",
  },
  {
    question: "Is there a Windows version?",
    answer: "Not right now. ScreenCam is focused on macOS, and we do not plan to develop a Windows version in the short term.",
  },
  {
    question: "Can I export to different formats?",
    answer: "ScreenCam is designed for high-quality video export from the editor, with framing and motion controls reflected in the final output.",
  },
  {
    question: "How does the zoom feature work?",
    answer: "You can add zoom points anywhere on your timeline. In manual mode, you have complete control: set multiple anchors with different zoom levels and focus centers. Transitions include smooth motion blur effects.",
  },
  {
    question: "Does it support multiple monitors?",
    answer: "ScreenCam is built for Mac screen recording workflows, including connected displays, windows, and capture regions.",
  },
];

export function FAQSection() {
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
            FAQ
          </p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-tight text-foreground">
            Questions & Answers
          </h2>
        </motion.div>

        {/* FAQ items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
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

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
