import type { ReactNode } from "react";
import { BiChevronLeft } from "react-icons/bi";
import { Link } from "react-router-dom";

type Props = {
    title: string;
    description?: string;
    actions?: ReactNode;
    backTo?: string;
};

export function PageHeader({ title, description, actions, backTo }: Props) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
                {backTo && (
                    <Link to={backTo} className="inline-flex items-center gap-0.5 text-xs font-medium text-neutral-500 hover:text-ink transition-colors mb-1">
                        <BiChevronLeft size={16} />
                        Back
                    </Link>
                )}
                <h1 className="main_title">{title}</h1>
                {description && <p className="muted">{description}</p>}
            </div>

            {actions && (
                <div className="flex flex-wrap items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}
