import React from "react";

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center bg-white w-full min-w-[430px] px-10">
      <div className="flex flex-col items-start gap-10">
        <div className="flex items-center gap-2">
          <span className="text-[#24570b] text-3xl font-semibold">Plantio</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          Login on <span className="text-green-600">Plantio</span>
        </h2>

        <p className="text-lg text-gray-700">
          Create an Aepod account, We can’t wait to have you.
        </p>

        <div className="w-full max-w-sm space-y-6">
          <input
            className="w-full p-3 bg-gray-100 rounded border border-gray-300 focus:outline-none"
            placeholder="Email"
            type="email"
          />

          <div className="relative">
            <input
              className="w-full p-3 bg-gray-100 rounded border border-gray-300 focus:outline-none"
              placeholder="Password"
              type="password"
            />
            <button className="absolute right-3 top-3 text-green-600 text-sm font-medium">
              Show
            </button>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 border-gray-300" />{" "}
              Remember Me
            </label>
            <button className="text-green-600">Forgot Password?</button>
          </div>

          <button className="w-full py-3 bg-green-600 text-white rounded font-medium text-lg">
            LOGIN
          </button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="#" className="text-green-600 underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
