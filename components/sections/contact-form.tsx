"use client";

import * as React from "react";
import { CheckCircle2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactForm() {
  const [envoye, setEnvoye] = React.useState(false);
  const [envoiEnCours, setEnvoiEnCours] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEnvoiEnCours(true);

    window.setTimeout(() => {
      setEnvoiEnCours(false);
      setEnvoye(true);
    }, 600);
  }

  if (envoye) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-muted/60 p-12 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-accent/15 text-gold-600">
          <CheckCircle2 className="size-7" />
        </span>
        <h3 className="font-heading text-xl font-semibold text-foreground">
          Message envoyé
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Merci pour votre message. Notre équipe vous répondra dans les
          meilleurs délais.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-border bg-card p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="nom"
            className="text-sm font-medium text-foreground"
          >
            Nom complet
          </label>
          <Input id="nom" name="nom" required placeholder="Jeanne Dupont" />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Adresse e-mail
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="jeanne.dupont@email.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="sujet" className="text-sm font-medium text-foreground">
          Sujet
        </label>
        <Input
          id="sujet"
          name="sujet"
          required
          placeholder="Demande de veille personnalisée"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-sm font-medium text-foreground"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Décrivez votre demande…"
          className="w-full rounded-2xl border border-input bg-background px-5 py-4 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>

      <Button
        type="submit"
        variant="accent"
        size="lg"
        className="w-full sm:w-auto"
        disabled={envoiEnCours}
      >
        {envoiEnCours ? "Envoi en cours…" : "Envoyer le message"}
        <Send className="size-4" />
      </Button>
    </form>
  );
}
