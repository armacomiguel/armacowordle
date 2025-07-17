"use client";

import { useEffect, useState } from "react";
// import { getPalabraDelDia } from "@/lib/utils/util";
import GameGridInvitado from "./GameGridInvitado";
import Keyboard from "./Keyboard";
import GameResultInvitado from "./GameResultInvitado";
import GameResumen from "./GameResumen";
import { AnimatePresence, motion } from "framer-motion";

const MAX_INTENTOS = 2;

export default function GameInvitado({setM1, setM2, setM3, setP1, setP2, setP3}) {
  // const { palabra, longitud } = getPalabraDelDia();
  const palabra = "MARIO";
  const longitud = 5;
  // console.log(palabra, longitud);

  const [intentos, setIntentos] = useState<string[]>([]);
  const [entradaActual, setEntradaActual] = useState("");
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [animarError, setAnimarError] = useState(false);
  
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [acerto, setAcerto] = useState(false);

  const manejarEnter = async () => {
    
    if (entradaActual.length !== longitud) {
      setAnimarError(true);
      setTimeout(() => setAnimarError(false), 1000);
      return;
    }

    // LIMPIA ANTES DE AGREGAR INTENTOS
    const palabraIngresada = entradaActual;
    setEntradaActual("");

    const nuevosIntentos = [...intentos, palabraIngresada];
    setIntentos(nuevosIntentos);

    const acerto = palabraIngresada === palabra;
    console.log(acerto);

    if(entradaActual.length >= 20){
      setP1(20);
      setM1(true);
    } else {
      setP1((prev: number) => prev + entradaActual.length);
    }
        
    if(entradaActual.length >= 5){
      setP3(5);
      setM3(true);
    } else {
      setP3(entradaActual.length);
    }

    if (acerto) {
        // aqui se termina el juego.
      setP2(1);
      setM2(true);
      setJuegoTerminado(true);
    } else if (nuevosIntentos.length >= MAX_INTENTOS) {
      setJuegoTerminado(true);
    }

    setAnimarError(false);
  };

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
}, [entradaActual, juegoTerminado, longitud, palabra]);


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
            className="flex flex-col items-center gap-6"
          >
            {mostrarResumen ? (
              <GameResumen
                intentos={intentos}
                palabraSecreta={palabra}
                acerto={acerto}
              />
            ) : (
              <GameResultInvitado
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
            className="flex flex-col items-center gap-6 mt-4"
          >
          <GameGridInvitado
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
