export const statusMap = {
    1: {
      label: "Draft",
      className: "bg-amber-50 text-amber-700 ring-amber-200",
      dot: "bg-amber-500",
    },
    2: {
      label: "Sent",
      className: "bg-sky-50 text-sky-700 ring-sky-200",
      dot: "bg-sky-500",
    },
    3: {
      label: "Received",
      className: "bg-brand-50 text-brand-700 ring-brand-200",
      dot: "bg-brand-500",
    },
    // Status 4: order has been assigned to a container
    4: {
      label: "In Container",
      className: "bg-violet-50 text-violet-700 ring-violet-200",
      dot: "bg-violet-500",
    },
    // Status 5: container has a carrier assigned
    5: {
      label: "Carrier Assigned",
      className: "bg-teal-50 text-teal-700 ring-teal-200",
      dot: "bg-teal-600",
    },
  } as const;
