"use client";

import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const [usuarioData, setUsuarioData] = useState<any>(null);

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

   useEffect(() => {
    const fetchUsuario = async () => {
      if (!user) return;
      try {
        const ref = doc(db, "usuarios", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUsuarioData(snap.data());
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
    <header className="w-full flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-md">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={irAlPerfil}
      >
        <img
          src={user.photoURL ?? ""}
          alt="Foto de perfil"
          className="w-10 h-10 rounded-full border-2 border-blue-600"
        />
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-800 dark:text-white">
            {usuarioData.username}
          </p>
          {/* <p className="text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </p> */}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
