"use client";

import { useEffect, useState } from "react";
import { getFechaHoy } from "@/lib/utils/util";
import { obtenerRankingDelDia } from "@/lib/firebase/ranking";

interface RankingProps {
  uid: string;
  username: string;
  fecha: string;
  intentos: number;
}

export default function RankingDiario() {
  const [ranking, setRanking] = useState<RankingProps[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      const data = await obtenerRankingDelDia(getFechaHoy());

      // Validar los datos que vienen del backend
      const parsed: RankingProps[] = data.map((doc) => doc as RankingProps);
      setRanking(parsed);
      setCargando(false);
    };

    fetchRanking();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-[#1d1d1d] border border-[#e5e5e5] dark:border-[#ffff00] rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">🏆 Ranking del día</h2>

      {cargando ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : ranking.length === 0 ? (
        <p className="text-center text-gray-600">
          ¡Sé el primero en aparecer en el ranking de hoy!
        </p>
      ) : (
        <div className="space-y-2">
          {ranking.map((item, i) => (
            <div
              key={item.uid}
              className="flex justify-between border-b dark:border-[#5e5e04] py-2"
            >
              <span className="font-medium text-[12px]">
                {i + 1}. {item.username}
              </span>
              <span className="text-sm text-gray-600 dark:text-white text-[12px]">
                {item.intentos} intento{item.intentos > 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
