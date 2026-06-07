'use client'

import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SearchCommand from "@/components/SearchCommand";
import { Search } from "lucide-react";
import { useState } from "react";

const NavItems = ({ initialStocks }: { initialStocks: StockWithWatchlistStatus[] }) => {
    const pathname = usePathname();
    const [searchOpen, setSearchOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    }

    return (
        <ul className="flex flex-col sm:flex-row p-2 gap-1 sm:gap-5 font-medium items-center">
            {NAV_ITEMS.map(({ href, label }) => {
                if (href === '/search') return (
                    <li key="search-trigger" className="relative">
                        {/* Mini search bar */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-600 transition-colors group"
                        >
                            <Search className="w-3 h-3 text-gray-500 group-hover:text-gray-300 transition-colors" />
                            <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors w-24">Search stocks...</span>
                            <span className="text-[10px] text-gray-700 border border-gray-700 rounded px-1 hidden lg:block">⌘K</span>
                        </button>
                        {/* SearchCommand opens as dialog */}
                        <SearchCommand
                            renderAs="controlled"
                            label="Search"
                            initialStocks={initialStocks}
                            open={searchOpen}
                            onOpenChange={setSearchOpen}
                        />
                    </li>
                );

                return (
                    <li key={href}>
                        <Link
                            href={href}
                            className={`text-xs font-medium hover:text-yellow-500 transition-colors ${
                                isActive(href) ? 'text-white' : 'text-gray-400'
                            }`}
                        >
                            {label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    )
}
export default NavItems