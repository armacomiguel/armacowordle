"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { Mision } from "@/types/Mision";

export default function Misiones() {
  const { user } = useAuth();
  const [misiones, setMisiones] = useState<Mision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const cargarMisiones = async () => {
      const globalSnap = await getDocs(collection(db, "misiones"));
      const misionesGlobales: Mision[] = [];

      for (const docGlobal of globalSnap.docs) {
        const datosGlobal = docGlobal.data();
        const refUsuario = doc(db, "usuarios", user.uid, "misiones", docGlobal.id);
        const snapUsuario = await getDoc(refUsuario);

        const datosUsuario = snapUsuario.exists() ? snapUsuario.data() : null;

        misionesGlobales.push({
          id: docGlobal.id,
          nombre: datosGlobal.nombre,
          descripcion: datosGlobal.descripcion,
          tipo: datosGlobal.tipo,
          requerido: datosGlobal.requerido,
          progreso: datosUsuario?.progreso || 0,
          completada: datosUsuario?.completada || false,
        });
      }

      setMisiones(misionesGlobales);
      setLoading(false);
    };

    cargarMisiones();
  }, [user]);

  if (loading) return <p className="text-center">Cargando misiones...</p>;

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white dark:bg-gray-900 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Misiones</h2>
      <div className="space-y-4">
        {misiones.map((mision) => {
          const progresoPorcentaje = Math.min(
            (mision.progreso / mision.requerido) * 100,
            100
          );

          return (
            <div key={mision.id} className="p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {mision.nombre}
                </h3>
                {mision.completada ? (
                  <span className="text-green-500 text-xs font-semibold">Completada</span>
                ) : (
                  <span className="text-yellow-500 text-xs font-semibold">
                    {mision.progreso}/{mision.requerido}
                  </span>
                )}
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded">
                <div
                  className="h-full bg-blue-500 rounded"
                  style={{ width: `${progresoPorcentaje}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
