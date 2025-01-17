"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import qs from "query-string";
import React, { useState, useEffect, Suspense } from "react";

import { useDebounce } from "@/hooks/use-debounce";

import { Input } from "./ui/input";

const SearchInputInner = () => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: debouncedValue,
          categoryId: currentCategoryId,
        },
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );

    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);

  return (
    <div className="relative">
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

const SearchInput = () => {
  return (
    <Suspense
      fallback={
        <div className="relative">
          <Search className="absolute top-3 left-3 h-4 w-4 text-slate-600" />
          <Input
            className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
            placeholder="Loading..."
            disabled
          />
        </div>
      }
    >
      <SearchInputInner />
    </Suspense>
  );
};

export default SearchInput;
