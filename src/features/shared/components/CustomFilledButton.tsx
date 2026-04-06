
type Props = {
    label: string;
    type: "submit" | "reset" | "button" | undefined;
    onClick?: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    fullWitdh?: boolean;
    className?: string;
}
export function CustomFilledButton({ label, type, onClick, icon, disabled = false, fullWitdh = false, className }: Props) {
    const hasIcon = icon ? true : false;
    const classNameComponent = `${fullWitdh ? 'w-full' : ''} bg-green-500 hover:bg-green-600 transition-colors hover:cursor-pointer p-2 rounded-md ${hasIcon ? 'flex items-center gap-2' : ''} ${className}`;

    return (
        <button disabled={disabled} type={type} className={classNameComponent} onClick={onClick ? () => onClick() : () => { }}>
            {icon ? (icon) : (<></>)}
            {disabled ? <p className="text-white font-semibold">Loading...</p> : (<p className="text-white font-semibold">{label}</p>)}
        </button>
    )
}
