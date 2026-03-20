type Props = {
  status: number;
};

const statusMap = {
    1: {
      label: "Draft",
      className: "bg-orange-200 text-orange-800",
    },
    2: {
      label: "Enviado",
      className: "bg-blue-200 text-blue-800",
    },
    3: {
      label: "Recibido",
      className: "bg-green-200 text-green-800",
    },
  } as const;

export function Tag({ status }: Props) {
  const current = statusMap[status as keyof typeof statusMap]!;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}