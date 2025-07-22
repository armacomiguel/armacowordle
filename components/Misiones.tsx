"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { actualizarExpYNivel } from "@/lib/firebase/usuario";

interface MisionGlobal {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: "diaria" | "larga";
  requerido: number;
}

interface MisionUsuario {
  progreso: number;
  completada: boolean;
}

export default function Misiones() {
  const { user } = useAuth();
  const [misiones, setMisiones] = useState<
    (MisionGlobal & MisionUsuario)[]
  >([]);
  const [loading, setLoading] = useState(true);

  const completarMision = async () => {
    if (!user || !user.uid) return; // Salir si no hay usuario

    await actualizarExpYNivel(user.uid, 10);
  };

  useEffect(() => {
    const cargarMisiones = async () => {
      if (!user) return;

      const snapGlobal = await getDocs(collection(db, "misiones"));
      const misionesGlobales: MisionGlobal[] = [];

      snapGlobal.forEach((doc) => {
        const data = doc.data();
        misionesGlobales.push({
          id: doc.id,
          nombre: data.nombre,
          descripcion: data.descripcion,
          tipo: data.tipo,
          requerido: data.requerido,
        });
      });

      const resultadosConProgreso = await Promise.all(
        misionesGlobales.map(async (mision) => {
          const refUsuario = doc(
            db,
            "usuarios",
            user.uid,
            "misiones",
            mision.id
          );
          const snapUsuario = await getDoc(refUsuario);

          if (!snapUsuario.exists()) {
            await setDoc(refUsuario, {
              progreso: 0,
              completada: false,
            });
            return { ...mision, progreso: 0, completada: false };
          } else {
            const data = snapUsuario.data() as MisionUsuario;
            return {
              ...mision,
              progreso: data.progreso ?? 0,
              completada: data.completada ?? false,
            };
          }
        })
      );

      setMisiones(resultadosConProgreso);
      setLoading(false);
    };

    cargarMisiones();
  }, [user]);

  if (loading) return <p className="text-center">Cargando misiones...</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Tus Misiones</h2>
      <div className="space-y-4">
        {misiones.map((mision) => {
          const porcentaje = Math.min(
            (mision.progreso / mision.requerido) * 100,
            100
          );

          return (
            <div
              key={mision.id}
              className="p-3 rounded-lg border bg-gray-50 dark:bg-[#27272a]">
              <div className="flex justify-between mb-1">
                <h3 className="font-medium">{mision.nombre}</h3>
                {mision.completada ? (
                  <span className="text-green-500 text-sm">Completada</span>
                ) : (
                  <span className="text-yellow-500 text-sm">
                    {mision.progreso}/{mision.requerido}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {mision.descripcion}
              </p>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded">
                <div
                  className="h-full bg-[#12acff] rounded"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
              {mision.completada && (
                <div className="">
                  <button onClick={() => completarMision()} 
                  className="w-full mt-2 bg-blue-400 text-white dark:bg-green-500 rounded-[8px] text-center p-1 font-bold dark:text-green-800">Obtener</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
