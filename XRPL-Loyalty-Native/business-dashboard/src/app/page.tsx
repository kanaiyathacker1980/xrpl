"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if business wallet is configured
    const hasWallet = localStorage.getItem("xrpl_business_wallet");
    
    if (hasWallet) {
      router.push("/dashboard");
    } else {
      router.push("/onboarding");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">XRPL Loyalty</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
