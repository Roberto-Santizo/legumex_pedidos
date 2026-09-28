import { NavLink } from "react-router-dom";
import type React from "react";

type Props = {
    to: string;
    children: React.ReactNode;
    label: string;
};

export function CustomNavLink({ to, children, label }: Props) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `group flex items-center gap-3 h-9 px-2.5 rounded-lg text-sm transition-colors duration-150 ${isActive
                    ? "bg-neutral-100 text-ink font-medium"
                    : "text-neutral-500 hover:text-ink hover:bg-neutral-50"}`
            }
        >
            {({ isActive }) => (
                <>
                    <span className={`text-lg transition-colors ${isActive ? "text-brand-600" : "text-neutral-400 group-hover:text-neutral-600"}`}>
                        {children}
                    </span>
                    <span className="truncate">{label}</span>
                </>
            )}
        </NavLink>
    );
}
