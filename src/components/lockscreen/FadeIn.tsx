"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type FadeInTag = "div" | "h1" | "p" | "nav" | "span";

// One motion component per tag, created once at module scope
// (motion.create() inside render would remount children every render).
const motionTags = {
  div: motion.create("div"),
  h1: motion.create("h1"),
  p: motion.create("p"),
  nav: motion.create("nav"),
  span: motion.create("span"),
} as const;

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = "div",
  className,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: FadeInTag;
  className?: string;
}) {
  const Tag = motionTags[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Tag>
  );
}
