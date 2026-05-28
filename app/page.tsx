import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export default async function LandingPage() {
  const { userId } = await auth();

  let userPlan = "free";

  if (userId) {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });
    if (user) userPlan = user.plan;
  }

  return (
    <main className="bg-[#0e0e10] min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing userPlan={userPlan} />
      <Footer />
    </main>
  );
}