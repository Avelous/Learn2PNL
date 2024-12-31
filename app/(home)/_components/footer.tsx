import React from "react";

import Image from "next/image";
import { SocialLink } from "./social-link";

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="Learn2PNL Logo"
              width={32}
              height={32}
            />
            <span className="text-xl font-semibold text-sky-700">
              Learn2PNL
            </span>
            <span className="text-sky-700"> © {currentYear}</span>
          </div>

          <div className="flex items-center space-x-6">
            <SocialLink
              href="https://discord.gg/learn2pnl"
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
