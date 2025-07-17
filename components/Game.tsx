"use client";

import { useEffect, useState } from "react";
import { getFechaHoy, getPalabraDelDia } from "@/lib/utils/util";
import GameGrid from "./GameGrid";
import Keyboard from "./Keyboard";
import GameResult from "./GameResult";
import GameResumen from "./GameResumen";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { guardarProgresoDiario, obtenerProgresoHoy  } from "@/lib/firebase/progreso";
import { actualizarStatsUsuario } from "@/lib/firebase/usuario";
import { guardarEnRanking } from "@/lib/firebase/ranking";
import { actualizarProgresoMisionUsuario, obtenerMisionesConProgreso } from "@/lib/firebase/misiones";
import { Mision } from "@/types/Mision";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface usuarioProps {
  username: string;
}

const MAX_INTENTOS = 5;

export default function Game() {
  const { palabra, longitud } = getPalabraDelDia();
  const { user } = useAuth();

  const [usuarioData, setUsuarioData] = useState<usuarioProps | null>(null);
  const [intentos, setIntentos] = useState<string[]>([]);
  const [entradaActual, setEntradaActual] = useState("");
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [animarError, setAnimarError] = useState(false);
  const [progresoCargado, setProgresoCargado] = useState(false);
  
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [acerto, setAcerto] = useState(false); // 👈 para el resumen
  const [misionesUsuario, setMisionesUsuario] = useState<Mision[]>([]);

  const revisarYActualizarMisiones = async (evento: "letra" | "palabra", cantidad: number) => {
    if (!user || !Array.isArray(misionesUsuario)) return;

    for (const mision of misionesUsuario) {
      if (!mision || !mision.nombre || mision.completada) continue;

      const nombreLower = mision.nombre.toLowerCase();

      const debeActualizar =
        (evento === "letra" && nombreLower.includes("escribe")) ||
        (evento === "palabra" && nombreLower.includes("adivina"));

      if (debeActualizar) {
        await actualizarProgresoMisionUsuario(user.uid, mision.id, cantidad);
      }
    }
  };

  const manejarEnter = async () => {
  if (entradaActual.length !== longitud) {
    setAnimarError(true);
    setTimeout(() => setAnimarError(false), 1000);
    return;
  }

  // LIMPIA ANTES DE AGREGAR INTENTOS
  const palabraIngresada = entradaActual;
  setEntradaActual(""); // 👈 esto primero

  const nuevosIntentos = [...intentos, palabraIngresada];
  setIntentos(nuevosIntentos);

  const acerto = palabraIngresada === palabra;

  if (user) {
    const letrasEscritas = palabraIngresada.length;
    const evento: "letra" | "palabra" = acerto ? "palabra" : "letra";
    await revisarYActualizarMisiones(evento, letrasEscritas);
  }

  if (acerto || nuevosIntentos.length >= MAX_INTENTOS) {
    setJuegoTerminado(true);

    if (user) {
      await guardarProgresoDiario({
        uid: user.uid,
        palabra,
        intentos: nuevosIntentos,
        acerto,
      });

      await actualizarStatsUsuario(user.uid, acerto);

      console.log("acerto: ", acerto);
      if (acerto) {
        await guardarEnRanking({
          uid: user.uid,
          username: usuarioData?.username || "",
          fecha: getFechaHoy(),
          intentos: nuevosIntentos.length,
        });
      }
    }
  }

  setAnimarError(false);
  };

  const cargarMisionesUsuario = async () => {
    if (!user) return;
    const lista = await obtenerMisionesConProgreso(user.uid);
    setMisionesUsuario(lista);
  };

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

  // Verifica si el usuario ya jugó hoy
  useEffect(() => {
    const verificarProgreso = async () => {
      if (!user) return;

      const progreso = await obtenerProgresoHoy(user.uid);

      if (progreso) {
        setIntentos(progreso.intentos || []);
        setJuegoTerminado(true);
        setAcerto(progreso.acerto || false);
        setMostrarResumen(true);
      }
      setProgresoCargado(true);

      fetchUsuario();
    };

    verificarProgreso();
  }, [user]);

 useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (juegoTerminado) return;

    if (e.key === "Enter") {
      manejarEnter();
    } else if (e.key === "Backspace") {
      setEntradaActual((prev) => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      if (entradaActual.length < longitud) {
        setEntradaActual((prev) => prev + e.key.toUpperCase());
      }
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [entradaActual, juegoTerminado, longitud, palabra, user]);

useEffect(() => {
  if (!user) return;
  cargarMisionesUsuario();
}, [user]);


  if (!progresoCargado) {
    return <div className="text-center mt-8">Cargando progreso...</div>;
  }

  return (
    <div  className="flex flex-col items-center gap-6">
      <AnimatePresence mode="wait">
        {juegoTerminado ? (
           <motion.div
            key="resultado"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6 mt-8"
          >
            {mostrarResumen ? (
              <GameResumen
                intentos={intentos}
                palabraSecreta={palabra}
                acerto={acerto}
              />
            ) : (
              <GameResult
                ganaste={intentos.includes(palabra)}
                intentos={intentos.length}
                palabraSecreta={palabra}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="juego"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6 mt-8"
          >
          <GameGrid
            intentos={intentos}
            longitud={longitud}
            maxIntentos={MAX_INTENTOS}
            palabraSecreta={palabra}
            entradaActual={entradaActual}
            filaActiva={intentos.length}
            animarError={animarError}
          />
        <Keyboard
          intentoActual={entradaActual}
          onKeyPress={(letra) => {
            if (juegoTerminado) return;

            if (letra === "ENTER") {
              manejarEnter();
            } else if (letra === "⌫") {
              setEntradaActual((prev) => prev.slice(0, -1));
            } else if (/^[A-Z]$/.test(letra)) {
              if (entradaActual.length < longitud) {
                setEntradaActual((prev) => prev + letra);
              }
            }
          }}
        />
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
