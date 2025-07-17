// lib/firebase/progreso.ts
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFechaHoy } from "../utils/util";

export interface ProgresoDiario {
  palabra: string;
  intentos: string[];
  acerto: boolean;
  fecha: string; // yyyy-MM-dd
  uid: string;
}

export async function guardarProgresoDiario({
  palabra,
  intentos,
  acerto,
  uid,
}: {
  palabra: string;
  intentos: string[];
  acerto: boolean;
  uid: string;
}): Promise<void> {
  const fecha = getFechaHoy();
  const docRef = doc(db, "progresos", `${uid}_${fecha}`);

  const progreso: ProgresoDiario = {
    palabra,
    intentos,
    acerto,
    fecha,
    uid,
  };

  await setDoc(docRef, progreso);
}

export async function obtenerProgresoHoy(userUid: string) {
  const fecha = getFechaHoy();
  const ref = doc(db, "progresos", `${userUid}_${fecha}`);

  const docSnap = await getDoc(ref);
  return docSnap.exists() ? docSnap.data() : null;
}