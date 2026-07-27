import {
  Globe2,
  Orbit,
  Rocket,
  ShieldCheck,
  Cpu,
  Lock,
  Layers,
  Bot,
  Radio,
  Landmark,
  Scale,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Globe2,
  Orbit,
  OrbitIcon: Orbit,
  Rocket,
  ShieldCheck,
  Cpu,
  Lock,
  Layers,
  Bot,
  Radio,
  Landmark,
};

export function resolveIcon(name: string): LucideIcon {
  return iconMap[name] ?? Scale;
}
