import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-cream-100 px-4 text-center">
      <SearchX className="h-20 w-20 text-maroon-300 mb-4" />
      <h1 className="text-2xl font-bold text-darkText mb-2">पृष्ठ भेटिएन</h1>
      <p className="text-lg text-warmBrown mb-6">माफ गर्नुहोस्, यो पृष्ठ उपलब्ध छैन।</p>
      <Link
        href="/ne"
        className="inline-flex items-center justify-center h-14 px-6 text-lg font-semibold rounded-xl bg-maroon-700 text-white hover:bg-maroon-800 transition-colors"
      >
        गृहपृष्ठमा फर्कनुहोस्
      </Link>
    </div>
  );
}
