"use client"
import { logout } from "@/services/api/auth"
import { useRouter } from "next/navigation"

export default function Menu() {
  const router = useRouter()

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("token")
    if (refreshToken) {
      const success = await logout(refreshToken)
      if (success) {
        router.push("/")
      } else {
        console.error("Error al cerrar sesión")
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4">
        <h1 className="text-4xl font-bold">
          <span>Register</span>
        </h1>
        <p>hola ya ingresaste</p>
        <button
          onClick={handleLogout}
          className="bg-[#D05A44] text-white px-4 py-2 rounded hover:bg-[#B84A37] transition"
        >
          Cerrar sesión
        </button>
      </div>
    </main>
  )
}
