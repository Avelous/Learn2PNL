import { Poppins } from "next/font/google";
import Image from "next/image";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <Image height={80} width={80} alt="logo" src="/logo.svg" />
      <h1 className={cn("text-3xl font-semibold text-sky-600", font.className)}>
        Learn2PNL
      </h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
