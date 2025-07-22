type Props = {
  intentoActual: string;
  onKeyPress: (key: string) => void;
};

export default function KeyboardInvitado({ onKeyPress }: Props) {
  const filas = [
    "QWERTYU".split(""),
    "IOPASDF".split(""),
    "GHJKLAS".split(""),
    "DFGHJKL".split(""),
    "ZXCVBNM".split(""),
    ["ENTER", "⌫"],
  ];

  return (
    <div className="flex flex-col gap-2">
      {filas.map((fila, i) => (
        <div key={i} className="flex justify-center gap-1">
          {fila.map((tecla) => {
            const isEnter = tecla === "ENTER";

            return (
              <button
                key={tecla}
                onClick={() => onKeyPress(tecla)}
                className={`px-3 py-2 rounded text-sm font-semibold
                  ${
                    isEnter
                      ? "bg-yellow-400 text-black px-12"
                      : "bg-gray-300"
                  }`}
              >
                {tecla}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
