import React from "react";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 flex flex-col items-center w-full max-w-md px-10 py-10 my-10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg min-h-[80vh] ">
      {children}
    </div>
  );
}
