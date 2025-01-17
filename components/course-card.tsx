"use client";

import { BookOpen, Cat } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { formatPrice } from "@/lib/format";

import { CourseProgress } from "./course-progress";
import { IconBadge } from "./icon-badge";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
}

const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-2 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt={title} src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2 ">
          <div className="text-sm font-medium group-hover:text-sky-700 transition line-clamp-2 ">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span className="text-xs">
                {chaptersLength}
                {chaptersLength === 1 ? " Chapter" : " Chapters"}
              </span>
            </div>
          </div>
          {progress != null ? (
            <CourseProgress
              size="sm"
              value={progress}
              variant={progress == 100 ? "success" : "default"}
            />
          ) : (
            <p className="text-md md:text-small font-medium text-slate-700">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
