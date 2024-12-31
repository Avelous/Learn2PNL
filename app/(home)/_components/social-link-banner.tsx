import Image from "next/image";
import Link from "next/link";

interface SocialLinkBannerProps {
  href: string;
  icon: string;
  label: string;
}

export const SocialLinkBanner = ({
  href,
  icon,
  label,
}: SocialLinkBannerProps) => (
  <Link
    href={href}
    className="text-sky-700 hover:text-sky-700/50 transition-colors flex border-2 border-sky-600 hover:border-sky-600/50 p-1 px-2 gap-2 items-center rounded-full text-xs w-fit"
    aria-label={label}
  >
    <Image
      src={`${icon}.svg`}
      alt={label}
      width={12}
      height={12}
    />
    <span>{label}</span>
  </Link>
);
