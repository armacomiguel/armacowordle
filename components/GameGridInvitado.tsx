import { motion } from "framer-motion";


type EstadoLetra = "correcto" | "casi" | "incorrecto";

function getEstadoLetras(intento: string, palabraSecreta: string): EstadoLetra[] {
  const resultado: EstadoLetra[] = Array(intento.length).fill("incorrecto");
  const letrasUsadasEnSecreta: boolean[] = Array(palabraSecreta.length).fill(false);

  for (let i = 0; i < intento.length; i++) {
    if (intento[i] === palabraSecreta[i]) {
      resultado[i] = "correcto";
      letrasUsadasEnSecreta[i] = true;
    }
  }

  for (let i = 0; i < intento.length; i++) {
    if (resultado[i] === "correcto") continue;

    for (let j = 0; j < palabraSecreta.length; j++) {
      if (!letrasUsadasEnSecreta[j] && intento[i] === palabraSecreta[j]) {
        resultado[i] = "casi";
        letrasUsadasEnSecreta[j] = true;
        break;
      }
    }
  }

  return resultado;
}

interface Props {
  intentos: string[];
  longitud: number;
  maxIntentos: number;
  palabraSecreta: string;
  entradaActual: string;
  filaActiva: number;
  animarError: boolean;
}

export default function GameGridInvitado({
  intentos,
  longitud,
  maxIntentos,
  palabraSecreta,
  entradaActual,
  filaActiva,
  animarError,
}: Props) {

  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: maxIntentos }, (_, fila) => {
        
        const esFilaActiva = fila === filaActiva;
        const intentoConfirmado = intentos[fila] ?? "";
        const keyFila = fila < filaActiva ? `${fila}-${intentoConfirmado}` : `fila-${fila}`;
        const estados = fila < filaActiva
          ? getEstadoLetras(intentoConfirmado, palabraSecreta)
          : Array(longitud).fill(null);

        const intento = esFilaActiva ? entradaActual : intentoConfirmado;

        return (
          <motion.div
            key={keyFila}
            className="grid gap-1 transition-all duration-200"
            style={{
              gridTemplateColumns: `repeat(${longitud}, minmax(0, 1fr))`,
            }}
            animate={animarError && esFilaActiva ? {
              x: [0, -70, 50, -30, 70, 0], // movimiento de shake horizontal
            } : { x: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {Array.from({ length: longitud }, (_, col) => {
              const letra = intento[col] ?? "";
              const estado = estados[col];

              let colorClass = "bg-white  border-2 border-gray-300 text-black";

              if (!esFilaActiva) {
                if (estado === "correcto") colorClass = "bg-green-500 text-white border-green-500";
                else if (estado === "casi") colorClass = "bg-yellow-400 text-white border-yellow-400";
                else if (estado === "incorrecto") colorClass = "bg-gray-300 text-gray-700 border-gray-300";
              } else {
                const siguientePos = entradaActual.length;
                if (col === siguientePos) {
                  colorClass += " border-blue-500 shadow-md shadow-blue-300";
                }
              }

              return (
                <motion.div
                  key={col}
                  className={`w-12 h-12 flex items-center justify-center text-2xl font-bold uppercase rounded ${colorClass}`}
                  initial={fila < filaActiva ? { rotateX: -90, opacity: 0 } : false}
                  animate={fila < filaActiva ? { rotateX: 0, opacity: 1 } : {}}
                  transition={{
                    duration: 0.3,
                    delay: fila < filaActiva ? col * 0.1 : 0,
                  }}
                >
                  {letra}
                </motion.div>
              );
            })}
          </motion.div>
        );
      })}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">
          Las palabras estan en español
        </p>
      </div>
    </div>
  );
}
