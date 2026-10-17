"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { FAQCopy, RichTextSegment } from "../lib/translations";
import { FillText } from "./mg/scene";

interface FAQItem {
  question: string;
  answer: string | RichTextSegment[];
}

export function FAQSection({ copy, sectionIndex }: { copy: FAQCopy; sectionIndex?: number }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="mg-scene">
      <div className="mx-auto grid w-full max-w-[1240px] gap-12 px-6 py-28 md:px-10 md:py-40 lg:grid-cols-12">
        <div className="faq-head lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <span className="mg-label mg-index mb-6 tabular-nums">
              {sectionIndex ? `${String(sectionIndex).padStart(2, "0")} — ` : ""}{copy.eyebrow}
            </span>
            <h2 className="mg-h2 mt-4 !text-[clamp(2.2rem,4.6vw,4.5rem)]"><FillText text={copy.title} /></h2>
          </div>
        </div>

        <div className="border-t border-foreground/20 lg:col-span-7">
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
        className="border-b border-foreground/20"
      >
        <button
          aria-controls={`faq-answer-${index}`}
          aria-expanded={isOpen}
          onClick={onToggle}
          className="group flex w-full items-start gap-5 py-6 text-left md:py-7"
        >
          <span className={`pt-1 font-mono text-[11px] tracking-[0.1em] transition-colors ${isOpen ? "text-[var(--mg-accent)]" : "text-muted-foreground"}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="flex-1 text-base font-medium tracking-[-0.01em] text-foreground transition-transform duration-300 group-hover:translate-x-1 md:text-lg">
            {item.question}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
              isOpen ? "border-[var(--mg-accent)] bg-[var(--mg-accent)] text-white" : "border-foreground/25 text-muted-foreground"
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
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
          <div className="pb-7 pl-[2.6rem] pr-6 pt-0 md:pr-16">
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {typeof item.answer === "string"
                ? item.answer
                : item.answer.map((segment, i) =>
                    typeof segment === "string" ? (
                      segment
                    ) : (
                      <a
                        key={i}
                        href={segment.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={isOpen ? undefined : -1}
                        className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-[var(--accent)]"
                      >
                        {segment.text}
                      </a>
                    ),
                  )}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
