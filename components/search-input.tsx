"use client";

import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import qs from "query-string";

const SearchInput = () => {
  const [value, setValue] = useState("");
  const deboouncedValue = useDebounce(value);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: deboouncedValue,
          categoryId: currentCategoryId,
        },
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );

    router.push(url);
  }, [deboouncedValue, currentCategoryId, router, pathname]);

  return (
    <div className="relative ">
      <Search className="absolute top-3 left-3 h-4 w-4 text-slate-600" />
      <Input
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for a course"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
