"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import { createMembershipRequestAction } from "../actions/create-membership-request.action";
import { MemberJoinForm } from "../components/member-join-form";
import type { MemberJoinFormValues } from "../validation/member-join.schema";

/**
 * Page publique « Rejoindre les Conducteurs de prière ». Après soumission,
 * la demande est enregistrée avec le statut `PENDING` (voir
 * `create-membership-request.action.ts`) — aucune redirection vers
 * l'application : le compte reste inactif tant qu'un administrateur ne l'a
 * pas validé (voir `/compte-en-attente`).
 */
export function MemberJoinView() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  async function handleSubmit(values: MemberJoinFormValues) {
    setIsSubmitting(true);
    try {
      const { photo, ...rest } = values;
      const result = await createMembershipRequestAction(rest, photo);
      if (result.success) {
        setIsSubmitted(true);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-4 text-center"
      >
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </span>
        <h1 className="text-xl font-semibold tracking-tight">Demande envoyée</h1>
        <p className="text-sm text-muted-foreground">
          Votre demande d&apos;adhésion a bien été enregistrée. Un administrateur va l&apos;examiner — vous pourrez vous
          connecter dès qu&apos;elle sera acceptée.
        </p>
        <Link href="/connexion" className="inline-block text-sm font-medium text-primary hover:underline">
          Retour à la connexion
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Rejoindre les Conducteurs de prière</h1>
        <p className="text-sm text-muted-foreground">
          Votre demande sera examinée par un administrateur avant l&apos;activation de votre compte.
        </p>
      </div>
      <MemberJoinForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      <p className="text-center text-sm text-muted-foreground">
        Déjà membre ?{" "}
        <Link href="/connexion" className="font-medium text-primary hover:underline">
          Connectez-vous
        </Link>
      </p>
    </div>
  );
}
