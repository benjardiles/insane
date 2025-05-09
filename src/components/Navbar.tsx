"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, ChevronDown, LogOut, User } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

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

              {!isAuthenticated ? (
                <>
                  {/* Dropdown Menu para Registro (solo si no está autenticado) */}
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
                </>
              ) : (
                <>
                  {/* Enlaces específicos según el rol del usuario */}
                  {user?.account_type === "tienda" && (
                    <Link
                      href="/menu/store/dashboard"
                      className="text-[#2D2A24] hover:text-[#D05A44] px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                  )}

                  {user?.account_type === "delivery" && (
                    <Link
                      href="/menu/delivery/available"
                      className="text-[#2D2A24] hover:text-[#D05A44] px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Pedidos Disponibles
                    </Link>
                  )}

                  {(user?.account_type === "normal" || user?.account_type === "client") && (
                    <Link
                      href="/menu/catalog"
                      className="text-[#2D2A24] hover:text-[#D05A44] px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Catálogo
                    </Link>
                  )}

                  {/* Menú de usuario */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="text-[#2D2A24] hover:text-[#D05A44] px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                    >
                      <User className="mr-1 h-4 w-4" />
                      <span>{user?.name?.split(' ')[0]}</span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                        >
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-[#2D2A24] hover:bg-[#F7F3E9] hover:text-[#D05A44]"
                            role="menuitem"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Mi Perfil
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left block px-4 py-2 text-sm text-[#2D2A24] hover:bg-[#F7F3E9] hover:text-[#D05A44]"
                            role="menuitem"
                          >
                            <div className="flex items-center">
                              <LogOut className="mr-2 h-4 w-4" />
                              <span>Cerrar Sesión</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}