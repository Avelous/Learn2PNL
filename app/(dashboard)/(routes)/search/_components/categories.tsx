"use client";

import { Category } from "@prisma/client";
import { FcCurrencyExchange } from "react-icons/fc";
import { FaBitcoin } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import CategoryItem from "./category-item";
import { Suspense } from "react";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  Forex: FcCurrencyExchange,
  Crypto: FaBitcoin,
};

const Categories = ({ items }: CategoriesProps) => {
  return (
    <Suspense>
      <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
        {items.map((item) => {
          return (
            <CategoryItem
              key={item.id}
              label={item.name}
              icon={iconMap[item.name]}
              value={item.id}
            />
          );
        })}
      </div>
    </Suspense>
  );
};

export default Categories;
