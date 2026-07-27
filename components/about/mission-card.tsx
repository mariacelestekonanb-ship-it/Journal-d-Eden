import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";

export interface MissionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Une des quatre facettes de la mission de LexWatch — carte non cliquable, purement informative. */
export function MissionCard({
  icon: Icon,
  title,
  description,
}: MissionCardProps) {
  return (
    <Card className="h-full p-8">
      <div className="bg-navy-900 flex size-12 items-center justify-center rounded-xl text-white">
        <Icon className="size-6" aria-hidden />
      </div>
      <div className="mt-6">
        <Heading as="h3" size="sm">
          {title}
        </Heading>
        <Paragraph tone="muted" size="sm" className="mt-2">
          {description}
        </Paragraph>
      </div>
    </Card>
  );
}
