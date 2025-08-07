import { db } from "@/lib/firebase";
import { Mision } from "@/types/Mision";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, getDocs, deleteDoc } from "firebase/firestore";

export async function inicializarMisiones(uid: string) {
  const misiones = [
    { id: "adivinaPalabra", requerido: 1, tipo: "diaria", nombre: "Adivina la palabra", descripcion: "Adivina la palabra correctamente una vez" },
    { id: "escribeTresLetras", requerido: 3, tipo: "diaria", nombre: "Escribe 3 letras", descripcion: "Escribe 3 letras en total" },
    { id: "juega10Dias", requerido: 10, tipo: "larga", nombre: "Juega 10 días", descripcion: "Completa el juego durante 10 días" },
  ];

  for (const mision of misiones) {
    const ref = doc(db, "usuarios", uid, "misiones", mision.id);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) {
      await setDoc(ref, {
        completada: false,
        progreso: 0,
        requerido: mision.requerido,
        tipo: mision.tipo,
        nombre: mision.nombre,
        descripcion: mision.descripcion,
        creadoEn: serverTimestamp(),
      });
    }
  }
}

export async function actualizarMision(uid: string, misionId: string, incremento = 1) {
  const ref = doc(db, "usuarios", uid, "misiones", misionId);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    const data = snapshot.data();
    if (!data.completada) {
      const nuevoProgreso = (data.progreso || 0) + incremento;
      const completada = nuevoProgreso >= (data.requerido || 1);

      await updateDoc(ref, {
        progreso: nuevoProgreso,
        completada,
        actualizadoEn: serverTimestamp(),
      });
    }
  } else {
    // Por si la misión no existe aún (opcional)
    await setDoc(ref, {
      progreso: incremento,
      completada: false,
      requerido: 1,
      tipo: "diaria",
      nombre: misionId,
      descripcion: "",
      creadoEn: serverTimestamp(),
    });
  }
}

export async function actualizarProgresoMisionUsuario(uid: string, misionId: string, incremento = 1) {
  const refGlobal = doc(db, "misiones", misionId);
  const refUsuario = doc(db, "usuarios", uid, "misiones", misionId);

  
  const snapGlobal = await getDoc(refGlobal);
  if (!snapGlobal.exists()) {
    console.warn("⚠️ Misión global no encontrada:", misionId);
    return;
  }
  
  const datosGlobal = snapGlobal.data();
  const requerido = datosGlobal.requerido || 1;

  const snapUsuario = await getDoc(refUsuario);

  let progreso = incremento;
  let completada = false;

  if (snapUsuario.exists()) {
    const datosUsuario = snapUsuario.data();
    progreso = Math.min((datosUsuario.progreso || 0) + incremento, requerido);
    completada = progreso >= requerido;
    await updateDoc(refUsuario, {
      progreso,
      completada,
      actualizadoEn: serverTimestamp(),
    });
  } else {
    completada = progreso >= requerido;
    await setDoc(refUsuario, {
      progreso,
      completada,
      actualizadoEn: serverTimestamp(),
    });
  }
}

interface MisionUsuario {
  nombre: string;
  descripcion: string;
  tipo: string;
  requerido: number;
  progreso: number;
  completada: boolean;
}

export async function obtenerMisionesConProgreso(uid: string): Promise<Mision[]> {
  const misionesGlobalRef = collection(db, "misiones");
  const snapGlobal = await getDocs(misionesGlobalRef);

  const misiones: Mision[] = [];

  for (const docGlobal of snapGlobal.docs) {
    const dataGlobal = docGlobal.data();
    const misionId = docGlobal.id;

    const misionUsuarioRef = doc(db, `usuarios/${uid}/misiones/${misionId}`);
    const snapUsuario = await getDoc(misionUsuarioRef);

    let progreso = 0;
    let completada = false;

    if (!snapUsuario.exists()) {
      // 🔥 Si no existe, se crea desde la global
      await setDoc(misionUsuarioRef, {
        nombre: dataGlobal.nombre,
        descripcion: dataGlobal.descripcion,
        tipo: dataGlobal.tipo,
        requerido: dataGlobal.requerido,
        progreso: 0,
        completada: false,
      });
    } else {
      const dataUsuario = snapUsuario.data();
      progreso = dataUsuario.progreso || 0;
      completada = dataUsuario.completada || false;

      // ⚠️ Revisar si faltan campos o están desactualizados
      const updates: Partial<MisionUsuario> = {};

      if (dataUsuario.nombre !== dataGlobal.nombre) updates.nombre = dataGlobal.nombre;
      if (dataUsuario.descripcion !== dataGlobal.descripcion) updates.descripcion = dataGlobal.descripcion;
      if (dataUsuario.tipo !== dataGlobal.tipo) updates.tipo = dataGlobal.tipo;
      if (dataUsuario.requerido !== dataGlobal.requerido) updates.requerido = dataGlobal.requerido;

      if (Object.keys(updates).length > 0) {
        await updateDoc(misionUsuarioRef, updates);
      }
    }

    misiones.push({
      id: misionId,
      nombre: dataGlobal.nombre,
      descripcion: dataGlobal.descripcion,
      tipo: dataGlobal.tipo,
      requerido: dataGlobal.requerido,
      progreso,
      completada,
    });
  }

  return misiones;
}

export async function eliminarMision(id: string) {
  await deleteDoc(doc(db, "misiones", id));
};

// export async function cargarMisiones(): Promise<Mision[]>{
//       // if (!user) return;

//   const misionesGlobales: Mision[] = [];
//   const snapGlobal = await getDocs(collection(db, "misiones"));

//   snapGlobal.forEach((doc) => {
//     const data = doc.data();
//     misionesGlobales.push({
//       id: doc.id,
//       nombre: data.nombre,
//       descripcion: data.descripcion,
//       tipo: data.tipo,
//       requerido: data.requerido,
//     });
//   });

//   const resultadosConProgreso = await Promise.all(
//     misionesGlobales.map(async (mision) => {
//       const refUsuario = doc(
//         db,
//         "usuarios",
//         user.uid,
//         "misiones",
//         mision.id
//       );
//       const snapUsuario = await getDoc(refUsuario);

//       if (!snapUsuario.exists()) {
//         await setDoc(refUsuario, {
//           progreso: 0,
//           completada: false,
//         });
//         return { ...mision, progreso: 0, completada: false };
//       } else {
//         const data = snapUsuario.data() as MisionUsuario;
//         return {
//           ...mision,
//           progreso: data.progreso ?? 0,
//           completada: data.completada ?? false,
//         };
//       }
//     })
//   );

//   // setMisiones(resultadosConProgreso);
//   // setLoading(false);
// };

