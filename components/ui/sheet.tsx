"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

/**
 * Panneau coulissant (drawer) bâti sur Radix Dialog : focus trap, fermeture
 * au clavier (Échap) et verrouillage du scroll sont gérés nativement.
 * L'animation d'ouverture/fermeture est pilotée par Framer Motion (voir
 * `SheetContent`), Radix se contentant de l'accessibilité.
 * Utilisé pour le menu de navigation mobile.
 */
function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(
  props: React.ComponentProps<typeof SheetPrimitive.Trigger>,
) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

export interface SheetContentProps extends Omit<
  React.ComponentProps<typeof SheetPrimitive.Content>,
  "forceMount"
> {
  side?: "left" | "right";
  /**
   * État ouvert du panneau. Doit refléter la même valeur que celle passée à
   * `<Sheet open>` : Framer Motion s'en sert pour jouer l'animation de
   * sortie avant le démontage réel du panneau.
   */
  open: boolean;
}

const closedX: Record<NonNullable<SheetContentProps["side"]>, string> = {
  left: "-100%",
  right: "100%",
};

function SheetContent({
  className,
  children,
  side = "right",
  open,
  ...props
}: SheetContentProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const panelTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 340, damping: 34 };
  const overlayDuration = prefersReducedMotion ? 0 : 0.2;

  return (
    <AnimatePresence>
      {open ? (
        <SheetPrimitive.Portal forceMount data-slot="sheet-portal">
          <SheetPrimitive.Overlay asChild forceMount>
            <motion.div
              className="bg-navy-950/40 fixed inset-0 z-50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: overlayDuration }}
            />
          </SheetPrimitive.Overlay>
          <SheetPrimitive.Content asChild forceMount {...props}>
            <motion.div
              data-slot="sheet-content"
              className={cn(
                "bg-background fixed inset-y-0 z-50 flex w-3/4 max-w-sm flex-col shadow-xl",
                side === "right"
                  ? "border-border right-0 border-l"
                  : "border-border left-0 border-r",
                className,
              )}
              initial={{ x: closedX[side] }}
              animate={{ x: 0 }}
              exit={{ x: closedX[side] }}
              transition={panelTransition}
            >
              {children}
              <SheetPrimitive.Close className="hover:bg-secondary focus-visible:ring-ring absolute top-5 right-5 rounded-full p-1.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none">
                <XIcon className="size-5" />
                <span className="sr-only">Fermer</span>
              </SheetPrimitive.Close>
            </motion.div>
          </SheetPrimitive.Content>
        </SheetPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-heading text-lg font-semibold", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
};
