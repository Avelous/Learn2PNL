import React from "react";

import Image from "next/image";
import { SocialLink } from "./social-link";
import { discordUrl } from "@/data/constants";

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12 py-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="Learn2PNL Logo"
              width={32}
              height={32}
            />
            <span className="text-sm font-semibold text-sky-700">
              Learn2PNL
            </span>
            <span className="text-sky-700 text-xs"> © {currentYear}</span>
          </div>

          <div className="flex items-center space-x-3">
            <SocialLink
              href={discordUrl}
              icon="discord"
              label="Join our Discord"
            />
            <SocialLink
              href="https://youtube.com/learn2pnl"
              icon="youtube"
              label="Watch on YouTube"
            />
            <SocialLink
              href="https://t.me/learn2pnl"
              icon="telegram"
              label="Join our Telegram"
            />
            <SocialLink
              href="https://x.com/learn2pnl"
              icon="x"
              label="Follow us on X"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
