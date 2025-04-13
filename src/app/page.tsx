import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-[#2D2A24] sm:text-5xl md:text-6xl">
            <span className="block">Bienvenido a</span>
            <span className="block text-[#D05A44]">LosCC</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-[#2D2A24] sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Wuatita Llena Corazón Contento - Hacemos crecer tu negocio. 
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/register/client"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#D05A44] hover:bg-[#B84A37] md:py-4 md:text-lg md:px-10"
              >
                Comenzar
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-[#2D2A24]">
            © 2024 LosCC. Todos los derechos reservados. Coquimbo, Chile
          </p>
        </div>
      </footer>
    </div>
  )
}
