type Props = {
  status: number;
};

const statusMap = {
    1: {
      label: "Draft",
      className: "bg-orange-200 text-orange-800",
    },
    2: {
      label: "Sent",
      className: "bg-blue-200 text-blue-800",
    },
    3: {
      label: "Received",
      className: "bg-green-200 text-green-800",
    },
    // Status 4: order has been assigned to a container
    4: {
      label: "In Container",
      className: "bg-purple-200 text-purple-800",
    },
    // Status 5: container has a carrier assigned
    5: {
      label: "Carrier Assigned",
      className: "bg-teal-200 text-teal-800",
    },
  } as const;

export function Tag({ status }: Props) {
  const current = statusMap[status as keyof typeof statusMap];

  if (!current) return null;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}