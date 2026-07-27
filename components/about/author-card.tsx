import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Tag } from "@/components/ui/tag";
import { Divider } from "@/components/ui/divider";

export interface AuthorCardProps {
  nom: string;
  initiales: string;
  photoUrl: string | null;
  role: string;
  presentation: string;
  parcours: string[];
  centresInteret: string[];
}

/**
 * Présentation de l'auteure de LexWatch. Structure volontairement plate
 * (props simples) pour rester facile à modifier depuis
 * `lib/author-config.ts`, seul fichier à éditer pour mettre ces
 * informations à jour. `photoUrl` à `null` affiche les initiales plutôt
 * qu'une image cassée tant qu'aucune vraie photo n'est fournie.
 */
export function AuthorCard({
  nom,
  initiales,
  photoUrl,
  role,
  presentation,
  parcours,
  centresInteret,
}: AuthorCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="grid gap-8 pt-8 sm:grid-cols-[auto_1fr] sm:items-start">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={nom}
              width={112}
              height={112}
              className="bg-secondary size-28 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden
              className="bg-navy-900 flex size-28 shrink-0 items-center justify-center rounded-full text-2xl font-semibold text-white"
            >
              {initiales}
            </span>
          )}
          <Heading as="h3" size="sm" className="mt-4">
            {nom}
          </Heading>
          <p className="text-muted-foreground text-sm">{role}</p>
        </div>

        <div>
          <Paragraph tone="muted">{presentation}</Paragraph>

          <Divider className="my-6" />

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Heading
                as="h4"
                size="xs"
                className="text-muted-foreground text-xs font-semibold tracking-wide uppercase"
              >
                Parcours
              </Heading>
              <ul className="mt-3 space-y-2">
                {parcours.map((etape) => (
                  <li
                    key={etape}
                    className="text-foreground border-border border-l-2 pl-3 text-sm"
                  >
                    {etape}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Heading
                as="h4"
                size="xs"
                className="text-muted-foreground text-xs font-semibold tracking-wide uppercase"
              >
                Centres d&apos;intérêt
              </Heading>
              <div className="mt-3 flex flex-wrap gap-2">
                {centresInteret.map((interet) => (
                  <Tag key={interet}>{interet}</Tag>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
