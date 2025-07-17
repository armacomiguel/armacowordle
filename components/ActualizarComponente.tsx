"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase"; // ajusta la ruta si es distinta
import { useAuth } from "@/context/AuthContext"; // ajusta si usas otro contexto

const ActualizarComponente = () => {
  const { user } = useAuth(); // Asegúrate que `user.uid` está disponible
  const [nuevoUsername, setNuevoUsername] = useState("");
  const [mensaje, setMensaje] = useState("");

  const actualizarUsername = async () => {
    if (!user || !nuevoUsername.trim()) {
      setMensaje("Debe ingresar un nombre válido.");
      return;
    }

    try {
      const ref = doc(db, "usuarios", user.uid);
      await updateDoc(ref, { username: nuevoUsername.trim() });
      setMensaje("Nombre actualizado correctamente, refresque la pagina.");
    } catch (error) {
      console.error("Error al actualizar:", error);
      setMensaje("Error al actualizar nombre.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-lg font-semibold">Actualizar nombre de usuario</h2>
      <input
        type="text"
        placeholder="Nuevo nombre"
        value={nuevoUsername}
        onChange={(e) => setNuevoUsername(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
      />
      <button
        onClick={actualizarUsername}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Actualizar
      </button>
      {mensaje && <p className="text-sm">{mensaje}</p>}
    </div>
  );
};

export default ActualizarComponente;
