
type Props = {
    label: string;
    type: "submit" | "reset" | "button" | undefined;
    onClick?: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
}
export function CustomFilledButton({ label, type, onClick, icon, disabled = false }: Props) {
    const hasIcon = icon ? true : false;
    const className = `bg-green-500 hover:bg-green-600 transition-colors hover:cursor-pointer p-2 rounded-md ${hasIcon ? 'flex items-center gap-2' : ''}`;

    return (
        <button disabled={disabled} type={type} className={className} onClick={onClick ? () => onClick() : () => { }}>
            {icon ? (icon) : (<></>)}
            <p className="text-white font-semibold">{label}</p>
        </button>
    )
}
