"use client";

import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";

interface usuarioProps {
  username: string;
}

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const [usuarioData, setUsuarioData] = useState<usuarioProps | null>(null);
  const [darkMode, setDarkMode] = useState(false); // 🌙

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const irAlPerfil = () => {
    router.push("/perfil");
  };

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      if (!user) return;
      try {
        const ref = doc(db, "usuarios", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUsuarioData(snap.data() as usuarioProps);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    fetchUsuario();
  }, [user]);

  if (!usuarioData) {
    return <p className="text-center mt-8">No se pudo cargar el header.</p>;
  }

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-white dark:bg-[#1d1d1d] shadow-md"
    style={{borderBottom: "1px solid #323232"}}>
      <div className="flex items-center gap-4 cursor-pointer" onClick={irAlPerfil}>
        <Image
          src={user?.photoURL ?? ""}
          alt="Foto de perfil"
          className="w-10 h-10 rounded-full border-2 border-blue-600"
          width={20}
          height={20}
        />
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-800 dark:text-white">
            {usuarioData.username}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* 🌙 Botón Toggle Dark/Light */}
        <button
          onClick={toggleDarkMode}
          className="text-sm px-3 py-2 rounded-lg border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {darkMode ? "☀️ Claro" : "🌙 Oscuro"}
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
