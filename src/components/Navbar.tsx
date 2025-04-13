"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, ChevronDown } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-[#F7F3E9] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-[#D05A44]">
              LosCC
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/"
                className="text-[#2D2A24] hover:text-[#D05A44] px-3 py-2 rounded-md text-sm font-medium"
              >
                Inicio
              </Link>
              
              {/* Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-[#2D2A24] hover:text-[#D05A44] px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                >
                  <span>Registrarse</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div 
                      className="py-1" 
                      role="menu" 
                      aria-orientation="vertical"
                    >
                      <Link
                        href="/register/store"
                        className="block px-4 py-2 text-sm text-[#2D2A24] hover:bg-[#F7F3E9] hover:text-[#D05A44]"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                      >
                        Tienda
                      </Link>
                      <Link
                        href="/register/client"
                        className="block px-4 py-2 text-sm text-[#2D2A24] hover:bg-[#F7F3E9] hover:text-[#D05A44]"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                      >
                        Cliente
                      </Link>
                      <Link
                        href="/register/delivery"
                        className="block px-4 py-2 text-sm text-[#2D2A24] hover:bg-[#F7F3E9] hover:text-[#D05A44]"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                      >
                        Repartidor
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/login"
                className="bg-[#D05A44] text-white hover:bg-[#B84A37] px-4 py-2 rounded-md text-sm font-medium"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}