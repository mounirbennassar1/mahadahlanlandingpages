/**
 * Central icon registry for all landing pages.
 *
 * - Social/brand icons → FontAwesome brands (`<SocialIcon name="instagram" />`)
 * - UI icons → Lucide React (re-exported as `Icon.*`)
 * - Extra icon sets (Heroicons, Feather, Bootstrap, etc.) → `react-icons` (import directly where needed)
 *
 * Import everywhere from `@/components/icons`.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faXTwitter,
  faFacebookF,
  faLinkedinIn,
  faTiktok,
  faYoutube,
  faWhatsapp,
  faSnapchat,
  faPinterestP,
  faTelegram,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const socialMap = {
  instagram: faInstagram,
  x: faXTwitter,
  twitter: faXTwitter,
  facebook: faFacebookF,
  linkedin: faLinkedinIn,
  tiktok: faTiktok,
  youtube: faYoutube,
  whatsapp: faWhatsapp,
  snapchat: faSnapchat,
  pinterest: faPinterestP,
  telegram: faTelegram,
  github: faGithub,
} as const satisfies Record<string, IconDefinition>;

export type SocialName = keyof typeof socialMap;

type SocialIconProps = {
  name: SocialName;
  className?: string;
  size?: "xs" | "sm" | "lg" | "xl" | "2x" | "3x";
};

export function SocialIcon({ name, className, size }: SocialIconProps) {
  return <FontAwesomeIcon icon={socialMap[name]} className={className} size={size} />;
}

// UI icons — re-export everything from lucide-react so landings can do:
// import { Icon } from "@/components/icons"; <Icon.ArrowRight />
import * as LucideIcons from "lucide-react";
export const Icon = LucideIcons;

// FontAwesome solid set is also available if a landing needs it.
export { FontAwesomeIcon };
