import { Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => {
        const faqElement = document.querySelector("#faq");
        if (faqElement) {
          faqElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } else {
      const faqElement = document.querySelector("#faq");
      if (faqElement) {
        faqElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const NavItems = () => (
    <>
      <button
        onClick={handleScroll}
        className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
      >
        FAQ
      </button>
      <Link
        href="/search"
        onClick={() => setIsOpen(false)}
        className="text-gray-700 hover:text-gray-900 flex items-center gap-2"
      >
        Courses
      </Link>
      <Link href={"/dashboard"} onClick={() => setIsOpen(false)}>
        <Button
          variant="outline"
          className="text-sky-700 hover:text-sky-700/50 border-sky-700 rounded-full"
        >
          <User className="h-4 w-4 mr-2" />
          {"Dashboard"}
        </Button>
      </Link>
    </>
  );

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Image
              src="/logo.svg"
              alt="Learn2PNL Logo"
              width={24}
              height={24}
              className=""
            />
            <h1 className="text-lg font-bold text-sky-700 ml-1">Learn2PNL</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavItems />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-6">
                  <NavItems />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
