"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Code2, Menu, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0e0e10]/95 backdrop-blur-md border-b border-[#27272a]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:bg-indigo-500">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-medium text-[15px] tracking-tight">
              Collabrix
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it Works", "Pricing"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-[#71717a] hover:text-[#fafafa] transition-colors duration-150 text-sm"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm h-9 px-4 rounded-lg transition-all duration-150"
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    className="text-[#71717a] hover:text-white hover:bg-[#18181b] text-sm h-9 px-4 rounded-lg transition-all duration-150"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm h-9 px-4 rounded-lg transition-all duration-150"
                  >
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#71717a] hover:text-white transition-colors p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-[#27272a] bg-[#0e0e10]">
            <div className="flex flex-col gap-1">
              {["Features", "How it Works", "Pricing"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-[#71717a] hover:text-white text-sm px-2 py-2 rounded-lg hover:bg-[#18181b] transition-all duration-150"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-[#27272a]">
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    className="w-full text-[#71717a] hover:text-white hover:bg-[#18181b] text-sm h-9"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm h-9">
                    Get started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
