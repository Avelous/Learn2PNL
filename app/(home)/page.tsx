"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

import { features } from "@/data/data";

import { useAuth } from "@clerk/nextjs";

import { Testimonials } from "./_components/testimonials";
import { Button } from "@/components/ui/button";
import Footer from "./_components/footer";
import { FAQ } from "./_components/faq";
import Navbar from "./_components/navbar";
import { Users, TvMinimalPlay, Trophy } from "lucide-react";

import { discordUrl } from "@/data/constants";

export default function LandingPage() {
  const { userId } = useAuth();

  return (
    <div className="min-h-screen text-sm">
      <Navbar userId={userId as string} />

      <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 mb-6 border-2">
              <span className="text-xs text-gray-600">
                Learn 2 secure profits n&apos; cut losses
              </span>
            </div>

            <h1 className=" lg:text-2xl font-bold leading-tight mb-6">
              Money making through trading is AN ART
              <br />
              We will teach you to master it
            </h1>

            <p className="text-gray-600 mb-8">
              Learn2PNL helps kickstart your trading journey with comprehensive
              courses that teach you to become a profitable trader, replace your
              income and work from anywhere.
            </p>

            <div className="mb-8">
              <p className="text-gray-600 mb-4">Over 500+ students taught</p>
              <div className="flex -space-x-2">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white"
                  />
                ))}
              </div>
            </div>

            <div className="flex space-x-4 text-xs">
              <Link href="/search">
                <Button variant="outline">Explore courses</Button>
              </Link>

              <Link href="/sign-up">
                <Button className="bg-sky-400 text-white rounded-lg hover:bg-sky-400/50 ">
                  Start learning
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src=""
                alt="Course preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 ">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Unlock Your Potential
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className=" py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <p className="text-sky-700 flex justify-center mb-3">
                <Users className="w-6 h-6" />
              </p>
              <p className="text-sm font-bold mb-1">500+</p>
              <p className="text-xs ">Active Students</p>
            </div>
            <div className="p-4">
              <p className="text-sky-700 flex justify-center mb-3">
                <Trophy className="w-6 h-6" />
              </p>
              <p className="text-sm font-bold mb-1">85%</p>
              <p className="text-xs ">Success Rate</p>
            </div>
            <div className="p-4">
              <p className="text-sky-700 flex justify-center mb-3">
                <TvMinimalPlay className="w-6 h-6" />
              </p>
              <p className="text-sm font-bold mb-1">100+</p>
              <p className="text-xs ">Hours of Content</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-sm text-gray-600 mb-8">
            <strong> Act fast!</strong> Join our community and learn from
            experienced traders
          </p>
          <Link href={discordUrl}
          target="_"
          >
            <Button className="bg-sky-500 hover:bg-sky-500/50">
              Gain Access
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sky-700 font-medium mb-2">Students love us</p>
          <h2 className="text-2xl font-bold mb-4">Student testimonials</h2>
          <p className="text-gray-600  max-w-3xl mx-auto">
            We&lsquo;ve helped hundreds of traders master profitable strategies
            and level up their careers, but don&lsquo;t just take our word for
            it.
          </p>
        </div>

        <Testimonials />
      </div>

      <FAQ />
      <Footer />
    </div>
  );
}
