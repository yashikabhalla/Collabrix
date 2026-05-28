import { Code2 } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0e0e10] border-t border-[#27272a] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center transition-all duration-150 group-hover:bg-indigo-500">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-[#fafafa] font-medium text-[15px] tracking-tight">Collabrix</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-8">
            {["Features", "How it works", "Pricing"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-[#52525b] hover:text-[#a1a1aa] text-sm transition-colors duration-150"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-[#3f3f46] text-sm">
            © 2026 Collabrix
          </p>

        </div>
      </div>
    </footer>
  );
}
