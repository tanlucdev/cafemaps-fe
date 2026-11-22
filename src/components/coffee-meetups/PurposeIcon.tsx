import {
  BookOpen,
  Camera,
  Coffee,
  Gamepad2,
  Languages,
  Laptop,
  MessageCircle,
  Music,
  Palette,
  Sparkles,
  UserPlus,
} from "lucide-react";

export const PURPOSE_ICONS = {
  book: BookOpen,
  work: Laptop,
  language: Languages,
  friends: UserPlus,
  chat: MessageCircle,
  coffee: Coffee,
  games: Gamepad2,
  music: Music,
  camera: Camera,
  art: Palette,
  sparkles: Sparkles,
};

export const PURPOSE_COLORS = {
  brown: "#875200",
  green: "#166638",
  blue: "#1d4ed8",
  purple: "#7e22ce",
  rose: "#be123c",
  orange: "#c2410c",
  teal: "#0f766e",
  slate: "#475569",
};

export default function PurposeIcon({
  name,
  color,
  className,
}: {
  name?: string | null;
  color?: string | null;
  className?: string;
}) {
  const Icon = Object.hasOwn(PURPOSE_ICONS, name ?? "")
    ? PURPOSE_ICONS[name as keyof typeof PURPOSE_ICONS]
    : Sparkles;
  return (
    <Icon
      size={16}
      style={{ color: color ?? PURPOSE_COLORS.brown }}
      className={className}
      aria-hidden="true"
    />
  );
}
