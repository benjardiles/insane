"use client"
import { logout } from "@/services/api/auth" // Importa la función logout
import { useRouter } from "next/navigation" // Importa useRouter para redirigir

export default function Menu() {
  const router = useRouter()

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("token") // Obtén el refresh token
    if (refreshToken) {
      const success = await logout(refreshToken)
      if (success) {
        router.push("/") // Redirige al usuario a la página principal después de cerrar sesión
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
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </main>
  )
}
