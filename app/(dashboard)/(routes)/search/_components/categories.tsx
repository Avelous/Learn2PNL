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

const CategoriesLoader = () => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="h-8 w-24 rounded-lg bg-gray-200 animate-pulse"
        />
      ))}
    </div>
  );
};

const CategoriesList = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};

const Categories = ({ items }: CategoriesProps) => {
  return (
    <Suspense fallback={<CategoriesLoader />}>
      <CategoriesList items={items} />
    </Suspense>
  );
};

export default Categories;
