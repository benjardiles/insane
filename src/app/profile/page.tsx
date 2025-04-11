import Profile from "./_ProfileForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4">
        <h1 className="text-4xl font-bold">
          {/* <span>Register</span> */}
        </h1>
        <Profile />
      </div>
    </main>
  )
}

