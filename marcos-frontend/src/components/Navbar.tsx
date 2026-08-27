'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="sticky top-0 z-50 bg-white border-b-2 border-black">
            <div className="px-6 py-4 flex justify-between items-start md:items-center gap-6 relative z-50 bg-white">
                {/* Heavy stacked logo */}
                <Link href="/" onClick={closeMenu} className="font-rocker font-normal text-4xl md:text-6xl uppercase tracking-tighter leading-[0.85] flex flex-col">
                    <span className="text-black">Marcos</span>
                    <span className="text-black">Villa Marin:</span>
                    <span className="text-accent">Portfolio</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex flex-wrap gap-6 text-xl font-bold tracking-widest uppercase mt-4 md:mt-0">
                    <Link href="/#gallery" className="hover:text-accent transition-colors">Art Work</Link>
                    <Link href="/about" className="hover:text-accent transition-colors">About Me</Link>
                    <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    className="md:hidden mt-2 p-2 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Menu"
                >
                    <div className="flex flex-col gap-1.5 w-8">
                        <span className={`block h-1 w-full bg-black transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                        <span className={`block h-1 w-full bg-black transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block h-1 w-full bg-black transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
                    </div>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b-2 border-black flex flex-col px-6 py-8 gap-6 shadow-xl z-40">
                    <Link href="/" onClick={closeMenu} className="font-rocker text-4xl md:text-6xl uppercase tracking-tighter leading-[0.85] flex flex-col">
                        Art Work
                    </Link>
                    <Link href="/about" onClick={closeMenu} className="text-2xl font-black uppercase tracking-widest hover:text-accent transition-colors">
                        About Me
                    </Link>
                    <Link href="/contact" onClick={closeMenu} className="text-2xl font-black uppercase tracking-widest hover:text-accent transition-colors">
                        Contact
                    </Link>
                </div>
            )}
        </nav>
    );
}