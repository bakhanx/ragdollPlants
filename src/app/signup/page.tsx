import React from "react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-10 py-20 bg-white">
      <div className="flex flex-col items-start gap-6 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-green-900">Plantio</h1>
        <h2 className="text-2xl font-bold text-gray-900">Register on <span className="text-green-700">Plantio</span></h2>
        <p className="text-gray-600">Create an Aepod account, We can’t wait to have you.</p>

        <input type="text" placeholder="Name" className="w-full p-3 bg-gray-100 rounded border border-gray-300 focus:outline-none" />
        <input type="email" placeholder="Email" className="w-full p-3 bg-gray-100 rounded border border-gray-300 focus:outline-none" />
        <input type="text" placeholder="Phone" className="w-full p-3 bg-gray-100 rounded border border-gray-300 focus:outline-none" />
        <input type="password" placeholder="Password" className="w-full p-3 bg-gray-100 rounded border border-gray-300 focus:outline-none" />
        <input type="password" placeholder="Repeat Password" className="w-full p-3 bg-gray-100 rounded border border-gray-300 focus:outline-none" />
        
        <div className="flex items-center gap-2">
          <input type="checkbox" className="w-4 h-4 text-green-700 border-gray-300 rounded" />
          <span className="text-sm text-gray-600">I Agree to the terms and conditions</span>
        </div>

        <button className="w-full p-3 text-white bg-green-700 rounded hover:bg-green-800">REGISTER</button>
      </div>
    </div>
  );
}
