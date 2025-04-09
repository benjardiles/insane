import LoginForm from "./login/_LoginForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen bg-[#F7F3E9]">
      {/* Header */}
      <header className="w-full p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#D05A44]">LosCC</h1>
          <p className="text-[#2D2A24]">Wuatita LLena Corazón Contento</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
          <div className="mt-6 text-center">
            <p className="text-[#2D2A24]">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/register"
                className="text-[#D05A44] hover:text-[#B84A37] font-medium"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center p-4 text-sm text-[#2D2A24]">
        <p>© 2024 LosCC. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
