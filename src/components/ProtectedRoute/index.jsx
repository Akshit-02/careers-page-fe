"use client";

import { getCurrentUser } from "aws-amplify/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const isPublicRoute = () => {
    if (pathname === "/login") return true;
    if (pathname === "/register") return true;

    // Matches /something/careers
    const careersMatch = /^\/[^/]+\/careers$/.test(pathname);
    if (careersMatch) return true;

    return false;
  };

  useEffect(() => {
    async function checkUser() {
      try {
        await getCurrentUser();
        setLoading(false);
      } catch (err) {
        // NOT logged in
        if (!isPublicRoute()) {
          router.replace("/login");
        } else {
          setLoading(false);
        }
      }
    }

    checkUser();
  }, [router, pathname]);

  if (loading) return <p>Loading...</p>;

  return children;
};

export default ProtectedRoute;
