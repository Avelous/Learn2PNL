"use client";

import dynamic from "next/dynamic";
import React, { useMemo } from "react";

import "react-quill/dist/quill.snow.css";

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

export const Editor = ({ value, onChange }: EditorProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  return (
    <div className="bg-white">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
};
