"use client";

import MisionesInvitado from "@/components/MisionesInvitado";
import GameInvitado from "@/components/GameInvitado";
import { useState } from "react";
import HeaderInvitado from "@/components/HeaderInvitado";

export default function Home() {

  const [mision1, setMision1] = useState(false);
  const [mision2, setMision2] = useState(false);
  const [mision3, setMision3] = useState(false);

  const [progreso1, setProgreso1] = useState(0);
  const [progreso2, setProgreso2] = useState(0);
  const [progreso3, setProgreso3] = useState(0);

  return (
    <main className="flex flex-col items-center min-h-[calc(100vh-80px)] p-4 gap-1">
      {/* <HeaderInvitado /> */}
      
      <div className="w-full lg:w-2/5">
        <MisionesInvitado 
          mision1={mision1}
          mision2={mision2}
          mision3={mision3}
          p1={progreso1}
          p2={progreso2}
          p3={progreso3}
        />
      </div>

      {/* Juego: ocupa el 100% en móvil, 60% en desktop */}
      <div className="w-full flex justify-center">
        <GameInvitado 
          setM1={setMision1}
          setM2={setMision2}
          setM3={setMision3}
          setP1={setProgreso1}
          setP2={setProgreso2}
          setP3={setProgreso3}
        />
      </div>
    </main>
  );
}
