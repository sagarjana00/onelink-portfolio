import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    const username = params.get("username")

    if (token) {
      localStorage.setItem("token", token)
      navigate(`/portfolio/${username}`)
    } else {
      navigate("/")
    }
  }, [navigate])

  return <p className="text-center text-xl mt-20">Signing you in...</p>
}
