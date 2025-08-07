"use client";
// app/login/page.tsx
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Si ya está logeado, redirige a /app
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Firebase maneja la sesión, el contexto se actualiza y redirige
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
      <h1 className="text-3xl font-bold mb-4">Bienvenido al juego Adivina el personaje</h1>
      <p className="mb-6 text-gray-500 dark:text-gray-400">
        Inicia sesión para comenzar a jugar
      </p>
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Iniciar sesión con Google
      </button>
    </div>
  );
}
