// lib/firebase/ranking.ts
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, collection, query, orderBy, getDocs } from "firebase/firestore";

export async function guardarEnRanking({
  uid,
  username,
  fecha,
  intentos,
}: {
  uid: string;
  username: string;
  fecha: string;
  intentos: number;
}) {
  const ref = doc(db, `ranking/${fecha}/entradas/${uid}`);

  await setDoc(ref, {
    uid,
    username,
    intentos,
    completadoEn: serverTimestamp(),
  });
}

export async function obtenerRankingDelDia(fecha: string) {
  const ref = collection(db, `ranking/${fecha}/entradas`);
  const q = query(ref, orderBy("intentos", "asc")); // opcional: orderBy("tiempo", "asc")

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}
