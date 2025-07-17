"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext"; // Asegúrate de tener esto
import Link from "next/link";

interface MisionGlobal {
  id?: string;
  nombre: string;
  descripcion: string;
  tipo: "diaria" | "larga";
  requerido: number;
}

const ADMIN_EMAILS = ["armacomiguel@gmail.com"]; // ← aquí pon tu(s) correo(s)

export default function AdminMisionesPage() {
  const { user } = useAuth();
  const [misiones, setMisiones] = useState<MisionGlobal[]>([]);
  const [nuevaMision, setNuevaMision] = useState({
    nombre: "",
    descripcion: "",
    tipo: "diaria",
    requerido: 1,
  });

  const cargarMisiones = async () => {
    const snap = await getDocs(collection(db, "misiones"));
    const datos: MisionGlobal[] = [];
    snap.forEach((doc) => {
      datos.push({ id: doc.id, ...(doc.data() as MisionGlobal) });
    });
    setMisiones(datos);
  };

  const crearMision = async () => {
    if (!nuevaMision.nombre.trim()) return;

    await addDoc(collection(db, "misiones"), nuevaMision);
    setNuevaMision({ nombre: "", descripcion: "", tipo: "diaria", requerido: 1 });
    cargarMisiones();
  };

  const eliminarMision = async (id: string) => {
    await deleteDoc(doc(db, "misiones", id));
    cargarMisiones();
  };

  useEffect(() => {
    if (user && ADMIN_EMAILS.includes(user.email ?? "")) {
      cargarMisiones();
    }
  }, [user]);

  if (!user) return <p className="text-center mt-10">Cargando usuario...</p>;

  if (!ADMIN_EMAILS.includes(user.email ?? "")) {
    return <p className="text-center text-red-600 mt-10">Acceso denegado.</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Misiones Globales</h1>

      <div>
        <Link href={"/"}>
            <button>Ir al home</button>
        </Link>
      </div>

      <div className="mb-6 border p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Crear nueva misión</h2>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Nombre"
          value={nuevaMision.nombre}
          onChange={(e) =>
            setNuevaMision((prev) => ({ ...prev, nombre: e.target.value }))
          }
        />
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Descripción"
          value={nuevaMision.descripcion}
          onChange={(e) =>
            setNuevaMision((prev) => ({ ...prev, descripcion: e.target.value }))
          }
        />
        <select
          className="border p-2 w-full mb-2"
          value={nuevaMision.tipo}
          onChange={(e) =>
            setNuevaMision((prev) => ({
              ...prev,
              tipo: e.target.value as "diaria" | "larga",
            }))
          }
        >
          <option value="diaria">Diaria</option>
          <option value="larga">Larga</option>
        </select>
        <input
          type="number"
          className="border p-2 w-full mb-2"
          placeholder="Requerido"
          value={nuevaMision.requerido}
          onChange={(e) =>
            setNuevaMision((prev) => ({
              ...prev,
              requerido: Number(e.target.value),
            }))
          }
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={crearMision}
        >
          Crear Misión
        </button>
      </div>

      <h2 className="text-lg font-semibold mb-2">Misiones existentes</h2>
      <ul className="space-y-2">
        {misiones.map((mision) => (
          <li
            key={mision.id}
            className="flex justify-between items-center p-2 border rounded"
          >
            <div>
              <p className="font-semibold">{mision.nombre}</p>
              <p className="text-sm text-gray-500">{mision.descripcion}</p>
              <p className="text-xs">Tipo: {mision.tipo}, Requiere: {mision.requerido}</p>
            </div>
            <button
              className="text-red-500 text-sm"
              onClick={() => eliminarMision(mision.id!)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
