import Image from "next/image";
import Link from "next/link";

interface SocialLinkProps {
  href: string;
  icon: string;
  label: string;
}

export const SocialLink = ({ href, icon, label }: SocialLinkProps) => (
  <Link
    href={href}
    aria-label={label}
  >
    <Image src={`${icon}.svg`} alt={label} width={18} height={18} />
  </Link>
);
