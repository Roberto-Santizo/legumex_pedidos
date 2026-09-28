
type Props = {
    label: string;
    type: "submit" | "reset" | "button" | undefined;
    onClick?: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    fullWitdh?: boolean;
    className?: string;
    variant?: 'primary' | 'brand' | 'secondary' | 'ghost' | 'danger';
}

const variantClass = {
    primary: 'btn_primary',
    brand: 'btn_brand',
    secondary: 'btn_secondary',
    ghost: 'btn_ghost',
    danger: 'btn_danger',
} as const;

export function CustomFilledButton({ label, type, onClick, icon, disabled = false, fullWitdh = false, className = '', variant = 'primary' }: Props) {
    const classNameComponent = `btn ${variantClass[variant]} ${fullWitdh ? 'w-full' : ''} ${className}`;

    return (
        <button disabled={disabled} type={type} className={classNameComponent} onClick={onClick ? () => onClick() : () => { }}>
            {disabled ? (
                <span className="size-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
            ) : icon}
            <span>{disabled ? 'Loading...' : label}</span>
        </button>
    )
}
