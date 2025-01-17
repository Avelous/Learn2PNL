"use client";

import { Plus, Minus } from "lucide-react";
import React from "react";

import { Separator } from "@/components/ui/separator";
import { discordUrl } from "@/data/constants";

import { SocialLinkBanner } from "./social-link-banner";

const faqContents = [
  {
    question: "What is Learn2PNL?",
    answer:
      "Learn2PNL is a comprehensive trading education platform focusing on Price Action trading and Risk Management. We help traders develop consistent profitability through rule-based strategies and proper risk management techniques.",
  },
  {
    question: "Are Learn2PNL courses completely free?",
    answer:
      "We offer both free and premium content. Our basic courses and community resources are free, while advanced strategies and personalized mentorship are available in our premium packages.",
  },
  {
    question: "How long do courses take to complete?",
    answer:
      "A course duration, in hours, can be found on every course’s page based. How long will it take you to complete these courses, is up to you and how much time you’ll dedicate to your learning.",
  },
  {
    question: "I have never traded before, are these courses suitable for me?",
    answer:
      "Absolutely! Our courses are designed for all skill levels, starting with fundamental concepts and progressively moving to advanced strategies. Complete beginners are welcome.",
  },
  {
    question: "When do Learn2PNL courses start?",
    answer:
      "Our courses are self-paced and available immediately after enrollment. You can start learning whenever you're ready and progress at your own pace.",
  },
  {
    question: "What is the Private Network and how can I join?",
    answer:
      "Our Private Network is an exclusive Discord community where members get direct access to expert traders, trade setups, and weekly webinars. To join, you'll need to purchase our Premium membership package.",
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState(-1);

  return (
    <section className="py-24 bg-gray-50 px-6" id="faq">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2">
        <div className="mb-12 ">
          <p className="text-sky-600 font-medium mb-2">Support</p>
          <h2 className="text-3xl font-bold mb-4">FAQs</h2>
          <p className="text-gray-600 mb-2">
            Can&lsquo;t find an answer? Join our Discord or follow us on
            Twitter.
          </p>
          <div className="flex space-x-4 flex-wrap">
            <SocialLinkBanner
              href={discordUrl}
              icon="discord"
              label="Discord"
            />
            <SocialLinkBanner
              href="https://x.com/learn2pnl"
              icon="twitter"
              label="twitter"
            />
          </div>
        </div>
        <div className="space-y-4">
          {faqContents.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden border-sky-500 border-2"
            >
              <button
                className="w-full px-6 py-4 flex justify-between items-center text-left"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span className="font-medium text-gray-900">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-gray-500" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-500" />
                )}
              </button>
              <Separator />

              <div
                className={`transition-all duration-500 ease-in-out ${
                  openIndex === index
                    ? "max-h-48 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <br />
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
