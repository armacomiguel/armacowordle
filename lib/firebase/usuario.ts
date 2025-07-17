// lib/firebase/usuario.ts
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp,  updateDoc, increment } from "firebase/firestore";

export const crearUsuarioSiNoExiste = async (uid: string, nombre: string) => {
  const ref = doc(db, "usuarios", uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    const nuevoUsuario = {
      uid,
      username: nombre,
      nivel: 1,
      exp: 0,
      expSiguienteNivel: 100,
      monedas: 0,
      racha: 0,
      creadoEn: serverTimestamp(),
    };

    await setDoc(ref, nuevoUsuario);
    console.log("✅ Usuario creado en Firestore");
  }
};

export async function actualizarStatsUsuario(uid: string, acerto: boolean) {
  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const datos = snap.data();
  let nuevaExp = datos.exp + 20; // ejemplo: 20 exp por jugar
  let nuevoNivel = datos.nivel;
  const nuevaRacha = acerto ? datos.racha + 1 : 0;
  let nuevaExpSiguiente = datos.expSiguienteNivel;

  if (nuevaExp >= nuevaExpSiguiente) {
    nuevaExp -= nuevaExpSiguiente;
    nuevoNivel += 1;
    nuevaExpSiguiente = Math.floor(nuevaExpSiguiente * 1.25); // escalar dificultad
  }

  await updateDoc(ref, {
    exp: nuevaExp,
    nivel: nuevoNivel,
    expSiguienteNivel: nuevaExpSiguiente,
    monedas: increment(10), // ejemplo: +10 monedas por jugar
    racha: nuevaRacha,
  });
}
