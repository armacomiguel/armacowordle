"use client";

import { useEffect, useState } from "react";


export default function MisionesInvitado({mision1, mision2, mision3, p1, p2, p3}) {

const misiones = [
  {
    id: 1, 
    nombre: "Sopa de letras",
    descripcion: "Escribe 20 letras, he pero no desperdicies oportunidades.",
    requerido: 20,
    tipo: "larga",
    progreso: p1,
    completada: mision1,
  },
  {
    id: 2,
    nombre: "El #1",
    descripcion: "adivina 1 palabra, ¿será al primer o segundo intento?",
    requerido: 1,
    tipo: "diaria",
    progreso: p2,
    completada: mision2,
  },
  {
    id: 3,
    nombre: "Escribe 5 letras",
    descripcion: "¿facil no?, soy el tutorial.",
    requerido: 5,
    tipo: "diaria",
    progreso: p3,
    completada: mision3,
  },
];


  return (
    <div className="max-w-md mx-auto p-2">
      <h2 className="text-xl font-bold mb-2 text-center">Misiones por completar</h2>
      <div className="space-y-2">
        {misiones.map((mision, index) => {
          const porcentaje = Math.min(
            (mision.progreso / mision.requerido) * 100,
            100
          );

          return (
            <div key={index} className="p-2 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800" >
              <div className="flex justify-between mb-1">
                <h3 className="font-medium">{mision.nombre}</h3>
                {mision.completada ? (
                  <span className="text-green-500 text-sm">Completada</span>
                ) : (
                  <span className="text-yellow-500 text-sm">
                    {mision.progreso}/{mision.requerido}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {mision.descripcion}
              </p>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded">
                <div
                  className="h-full bg-blue-600 rounded"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
