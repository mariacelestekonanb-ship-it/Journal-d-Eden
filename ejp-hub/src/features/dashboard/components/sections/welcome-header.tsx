"use client";

import { motion } from "framer-motion";

import { useGreeting } from "../../hooks/use-greeting";

export interface WelcomeHeaderProps {
  firstname: string;
}

/** Message de bienvenue : salutation dynamique, prénom, date et heure courantes. */
export function WelcomeHeader({ firstname }: WelcomeHeaderProps) {
  const { salutation, time, date } = useGreeting();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {salutation}, {firstname}
        </h1>
        <p className="text-sm capitalize text-muted-foreground">{date}</p>
      </div>
      <p className="text-2xl font-semibold tabular-nums text-foreground" aria-label={`Il est ${time}`}>
        {time}
      </p>
    </motion.div>
  );
}
