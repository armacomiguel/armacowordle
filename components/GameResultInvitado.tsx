"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";

interface Props {
  ganaste: boolean;
  intentos: number;
  palabraSecreta: string;
}

export default function GameResult({ ganaste, intentos, palabraSecreta }: Props) {

  useEffect(() => {
    if (ganaste) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
      });
    }
  }, [ganaste]);

  return (
    <div className="text-center flex flex-col items-center justify-center gap-4 mt-10">
      <h2 className="text-3xl font-bold">
        {ganaste ? "🎉 ¡Felicidades!" : "😞 ¡Inténtalo de nuevo!"}
      </h2>
      <p className="text-xl">
        {ganaste
          ? `Adivinaste la palabra en ${intentos} intento${intentos === 1 ? "." : "s."}`
          : `La palabra era: `}
        <span className="font-bold text-blue-600">{!ganaste && palabraSecreta}</span>
      </p>
      <p>Crea una cuenta para tener acceso completo al <span>RANKING</span>, <span>MISIONES</span>, <span>PERFIL</span> y <span>MODO OSCURO</span>.</p>
      <Link href="/login">
        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Iniciar sesión</button>
      </Link>
    </div>
  );
}
