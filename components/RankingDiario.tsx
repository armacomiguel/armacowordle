"use client";

import { useEffect, useState } from "react";
import { getFechaHoy } from "@/lib/utils/util";
import { obtenerRankingDelDia } from "@/lib/firebase/ranking";

export default function RankingDiario() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      const data = await obtenerRankingDelDia(getFechaHoy());
      setRanking(data);
      setCargando(false);
    };
    fetchRanking();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">🏆 Ranking del día</h2>

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
              className="flex justify-between border-b border-gray-200 py-2"
            >
              <span className="font-medium">
                {i + 1}. {item.username}
              </span>
              <span className="text-sm text-gray-600">
                {item.intentos} intento{item.intentos > 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
