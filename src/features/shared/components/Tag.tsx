import { statusMap } from "./orderStatus";

type Props = {
  status: number;
};

export function Tag({ status }: Props) {
  const current = statusMap[status as keyof typeof statusMap];

  if (!current) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-xs font-medium ring-1 ring-inset whitespace-nowrap ${current.className}`}
    >
      <span className={`size-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
}
