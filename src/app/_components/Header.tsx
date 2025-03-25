// _components/Header.js
import React from "react";

type HeaderProps = {
    mainText:string,
    subText:string,
}

function Header({ mainText, subText } : HeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6 flex-col">
      <h1 className="text-4xl font-semibold text-green-600">{mainText}</h1>
      <h3 className="text-white text-lg">{subText}</h3>
    </div>
  );
}

export default Header;
