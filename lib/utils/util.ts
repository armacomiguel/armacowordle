import { personajesPorLongitud } from "../personajesPorLongitud";
import { format } from "date-fns";

function getSeedFromDate(date: Date): number {
  const start = new Date(2025, 0, 1); // Enero 1, 2025
  const diff = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export function getPalabraDelDia(): { palabra: string; longitud: number } {
  const today = new Date();
  const seed = getSeedFromDate(today);

  const longitudesDisponibles = Object.keys(personajesPorLongitud).map(Number);
  const longitudIndex = seed % longitudesDisponibles.length;
  const longitud = longitudesDisponibles[longitudIndex];

  const lista = personajesPorLongitud[longitud];
  const palabraIndex = seed % lista.length;

  return {
    palabra: lista[palabraIndex],
    longitud,
  };
}

export function getPalabraAleatoria(): { palabra: string; longitud: number } {
  const longitudesDisponibles = Object.keys(personajesPorLongitud).map(Number);
  const longitudIndex = Math.floor(Math.random() * longitudesDisponibles.length);
  const longitud = longitudesDisponibles[longitudIndex];

  const lista = personajesPorLongitud[longitud];
  const palabraIndex = Math.floor(Math.random() * lista.length);

  return {
    palabra: lista[palabraIndex],
    longitud,
  };
}

export const getFechaHoy = () => format(new Date(), "yyyy-MM-dd");
