import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/logo.png" alt="AI.MAGED" width={40} height={40} className="h-9 w-auto" />
              <span className="text-2xl font-bold text-electric-500">AI</span>
              <span className="text-2xl font-bold text-white">.MAGED</span>
            </div>
            <p className="text-sm max-w-md">
              A focused library of carefully selected books across subjects, genres, languages, and formats.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Library</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/books" className="hover:text-white">All Books</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              <li><Link href="/affiliate-disclosure" className="hover:text-white">Disclosure</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} AI.MAGED. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
