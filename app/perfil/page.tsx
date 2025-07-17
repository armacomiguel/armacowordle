"use client";

import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";
import ActualizarComponente from "@/components/ActualizarComponente";

export default function PerfilPage() {
  const { user } = useAuth();
  const [usuarioData, setUsuarioData] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

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
      } finally {
        setCargando(false);
      }
    };

    fetchUsuario();
  }, [user]);

  if (cargando) {
    return <p className="text-center mt-8">Cargando perfil...</p>;
  }

  if (!user || !usuarioData) {
    return <p className="text-center mt-8">No se pudo cargar el perfil.</p>;
  }

  const { nivel, exp, expSiguienteNivel, monedas, racha } = usuarioData;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center gap-4">
        <img
          src={user.photoURL || "/user-placeholder.png"}
          alt="Foto de perfil"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold">{usuarioData.username}</h2>
          {/* <p className="text-sm text-gray-500">{user.email}</p> */}
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <p className="font-medium">Nivel: {nivel}</p>
          <div className="w-full h-4 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{
                width: `${(exp / expSiguienteNivel) * 100}%`,
              }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {exp} / {expSiguienteNivel} XP
          </p>
        </div>

        <p className="font-medium">💰 Monedas: {monedas}</p>
        <p className="font-medium">🔥 Racha: {racha} días</p>
      </div>

      <ActualizarComponente />

      <Link href="/">
        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Ir al Home</button>
      </Link>
    </div>
  );
}
