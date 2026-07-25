"use client";

import * as React from "react";

export interface UseDisclosureReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  /** Setter direct, pratique pour brancher `onOpenChange` des composants Radix. */
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * Gère un état ouvert/fermé (drawer, dialog, popover…) avec des callbacks
 * stables, pour éviter de recréer des setters inline dans chaque composant.
 */
export function useDisclosure(defaultOpen = false): UseDisclosureReturn {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((value) => !value), []);

  return { isOpen, open, close, toggle, setIsOpen };
}
