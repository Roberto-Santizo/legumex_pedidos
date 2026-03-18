
type Props = {
    label: string;
    type: "submit" | "reset" | "button" | undefined;
}
export function CustomFilledButton({ label, type }: Props) {
    return (
        <button type={type} className="bg-green-500 hover:bg-green-600 transition-colors hover:cursor-pointer p-2 rounded-md">
            <p className="text-white font-semibold">{label}</p>
        </button>
    )
}
