import RegisterFormStore from "./_RegisterFormStore"

export default function RegisterStore() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4">
        <RegisterFormStore />
      </div>
    </main>
  )
}