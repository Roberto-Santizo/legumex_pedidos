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
                `
                    flex items-center gap-3 px-3 py-2 rounded-lg
                    text-sm font-medium transition-all duration-150
                    ${isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}
                `
            }
        >
            <span className="text-lg">{children}</span>
            <span>{label}</span>
        </NavLink>
    );
}