import { LucideIcon } from "lucide-react";
import React from "react";

import { IconBadge } from "@/components/icon-badge";

interface InfoCardProps {
  variant?: "default" | "success";
  icon: LucideIcon;
  numberOfItems: number;
  label: string;
}

export const InfoCard = ({
  variant,
  icon: Icon,
  numberOfItems,
  label,
}: InfoCardProps) => {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
      <IconBadge variant={variant} icon={Icon} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-grey-500 text-sm">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
};
