import React from "react";

type CheckboxProps = {
  label: string;
};

export const Checkbox = ({ label }: CheckboxProps) => {
  return (
    <div className="flex items-center gap-2">
      <input type="checkbox" className="w-5 h-5 " />
      <span className="text-sm text-gray-200">{label}</span>
    </div>
  );
};
