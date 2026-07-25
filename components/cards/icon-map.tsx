import {
  Globe2,
  Orbit,
  Rocket,
  ShieldCheck,
  Cpu,
  Lock,
  Layers,
  Scale,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Globe2,
  Orbit,
  OrbitIcon: Orbit,
  Rocket,
  ShieldCheck,
  Cpu,
  Lock,
  Layers,
};

export function resolveIcon(name: string): LucideIcon {
  return iconMap[name] ?? Scale;
}
