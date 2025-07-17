type Props = {
  intentoActual: string;
  onKeyPress: (key: string) => void;
};

export default function Keyboard({ onKeyPress }: Props) {
  const filas = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    ["ENTER", ..."ZXCVBNM".split(""), "⌫"],
  ];

  return (
    <div className="flex flex-col gap-2">
      {filas.map((fila, i) => (
        <div key={i} className="flex justify-center gap-1">
          {fila.map((tecla) => (
            <button
              key={tecla}
              onClick={() => onKeyPress(tecla)}
              className="bg-gray-300 dark:bg-gray-700 px-3 py-2 rounded text-sm font-semibold"
            >
              {tecla}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
