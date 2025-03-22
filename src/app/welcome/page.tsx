import React from "react";

export default function Page() {
  return (
    <div>
      <div
        className="flex min-h-screen items-center px-10 py-20 bg-gradient-to-b from-transparent to-[#152b0a] bg-cover bg-center shadow-lg"
        style={{
            
          backgroundImage:
            "url(https://c.animaapp.com/m8jyupbtBv3Vrq/img/-welcome.png)",
            
        }}
      >
        <div className="flex flex-col items-start gap-28">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* <BrokenNatureTravelLeaf1 className="w-14 h-14" /> */}
            <h1 className="text-[#24570b] text-4xl font-normal">
              RagdollPlants
            </h1>
          </div>

          {/* Welcome Message */}
          <div className="flex flex-col gap-5">
            <h2 className="text-white text-3xl font-medium">
              Welcome to Plantio
            </h2>
            <p className="text-white text-base tracking-wide leading-relaxed">
              Feel fresh with plant worlds.
              <br />
              It will enhance your living space!
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-5 w-full max-w-xs">
            <button className="h-14 w-full text-xl font-medium text-white border-2 border-white rounded-lg">
              REGISTER
            </button>
            <button className="h-14 w-full text-xl font-medium text-[#323c06] bg-white rounded-lg border">
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
