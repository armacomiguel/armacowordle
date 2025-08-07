const LOCAL_STORAGE_KEY = "progresoWordle";

export function guardarProgresoLocal(
  dia: string,
  palabra: string,
  intentos: string[],
  acerto: boolean
) {
  const data = {
    dia,
    palabra,
    intentos,
    acerto,
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

export function obtenerProgresoLocal() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function limpiarProgresoLocal() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}
