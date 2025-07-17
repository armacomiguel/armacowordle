"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Game from "../components/Game";
import RankingDiario from "@/components/RankingDiario";
import Misiones from "@/components/Misiones"; // 👈 nuevo import

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/invitado");
    }
  }, [loading, user]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      {/* <main className="flex flex-row justify-center items-start min-h-[calc(100vh-80px)] p-4 gap-8"> */}
      <main className="flex flex-col lg:flex-row lg:items-start lg:mt-10 items-center min-h-[calc(100vh-80px)] p-8 gap-2">
        {/* Columna izquierda: Ranking */}
        <div className="w-full max-w-xs">
          <RankingDiario />
        </div>

        {/* Columna central: Game */}
        <div className="flex-1 flex justify-center">
          <Game />
        </div>

        {/* Columna derecha: Misiones */}
        <div className="w-full max-w-xs">
          <Misiones />
        </div>
      </main>
    </>
  );
}
