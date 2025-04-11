import ForgotPasswordForm from "./_ForgotPasswordForm"

export default function ForgotPassword() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4">
        <ForgotPasswordForm />
      </div>
    </main>
  )
}