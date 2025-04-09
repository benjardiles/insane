import LoginForm from "./_LoginForm"

export default function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4">
        <h1 className="text-4xl font-bold">
          <span>Iniciar Sesión</span>
        </h1>
        <LoginForm />
      </div>
    </main>
  )
}
