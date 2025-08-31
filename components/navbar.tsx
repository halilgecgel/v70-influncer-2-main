"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/90 backdrop-blur-xl border-b border-green-500/20 shadow-lg shadow-green-500/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto mobile-padding px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link href="/" className="transform hover:scale-105 transition-transform duration-300">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.JPG-CrCcuJaqI3JXZPdI1EQpGWcLp4AReM.jpeg"
              alt="kesif Collective"
              width={200}
              height={80}
              className="h-12 sm:h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-green-400 transition-all duration-300 font-medium hover:scale-105 transform text-sm lg:text-base"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-green-400 transition-all duration-300 font-medium hover:scale-105 transform text-sm lg:text-base"
            >
              Hakkımızda
            </Link>
            <Link
              href="/influencers"
              className="text-gray-300 hover:text-green-400 transition-all duration-300 font-medium hover:scale-105 transform text-sm lg:text-base"
            >
              Influencerlarımız
            </Link>
            <Link
              href="/brands"
              className="text-gray-300 hover:text-green-400 transition-all duration-300 font-medium hover:scale-105 transform text-sm lg:text-base"
            >
              Markalar
            </Link>
            <ThemeToggle />
            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:scale-110 transform transition-all duration-300 font-semibold text-sm px-4 py-2 lg:px-6 lg:py-2 shadow-lg shadow-green-500/25">
              Hemen Başla
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:scale-110 transform transition-all duration-300 h-10 w-10 text-gray-300 hover:text-green-400 hover:bg-green-500/10"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-green-500/20 animate-fade-in-up-3d rounded-b-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-3 text-gray-300 hover:text-green-400 transition-colors font-medium rounded-lg hover:bg-green-500/10"
                onClick={() => setIsOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link
                href="/about"
                className="block px-3 py-3 text-gray-300 hover:text-green-400 transition-colors font-medium rounded-lg hover:bg-green-500/10"
                onClick={() => setIsOpen(false)}
              >
                Hakkımızda
              </Link>
              <Link
                href="/influencers"
                className="block px-3 py-3 text-gray-300 hover:text-green-400 transition-colors font-medium rounded-lg hover:bg-green-500/10"
                onClick={() => setIsOpen(false)}
              >
                Influencerlarımız
              </Link>
              <Link
                href="/brands"
                className="block px-3 py-3 text-gray-300 hover:text-green-400 transition-colors font-medium rounded-lg hover:bg-green-500/10"
                onClick={() => setIsOpen(false)}
              >
                Markalar
              </Link>
              <div className="px-3 py-2">
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25"
                  onClick={() => setIsOpen(false)}
                >
                  Hemen Başla
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
