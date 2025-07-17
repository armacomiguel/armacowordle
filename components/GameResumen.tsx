"use client";

import Link from "next/link";

interface Props {
  intentos: string[];
  palabraSecreta: string;
  acerto: boolean;
}

export default function GameResumen({ intentos, palabraSecreta, acerto }: Props) {
  return (
    <div className="text-center flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">
        Ya jugaste hoy
      </h2>
      <p>
        Palabra secreta: <span className="font-mono">{palabraSecreta}</span>
      </p>
      <p>
        {acerto
          ? `¡Acertaste en ${intentos.length} intento(s)! 🎉`
          : `No acertaste. Usaste ${intentos.length} intento(s). 😢`}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Vuelve mañana para jugar de nuevo.
      </p>
      <Link href="/perfil">
        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Ver perfil</button>
      </Link>
    </div>
  );
}
