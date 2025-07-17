export interface Mision {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: "diaria" | "larga";
  requerido: number;
  progreso: number;
  completada: boolean;
}


