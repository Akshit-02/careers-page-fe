"use client";

import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

const TopNav = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="fixed top-0 right-0 left-64 bg-white border-b border-gray-200 h-16 flex items-center justify-end px-6 z-10">
      <button
        onClick={handleLogout}
        className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        title="Logout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
    </header>
  );
};

export default TopNav;
