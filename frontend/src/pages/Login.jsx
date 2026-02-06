export default function Login() {
  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:8000/auth/login"
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-4xl font-bold mb-8">OneLink Portfolio</h1>

      <button
        onClick={handleGitHubLogin}
        className="bg-black text-white px-8 py-4 rounded-lg text-lg hover:bg-gray-800 transition"
      >
        Sign in with GitHub
      </button>
    </div>
  )
}
