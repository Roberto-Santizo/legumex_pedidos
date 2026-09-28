import { useSelector } from "react-redux";
import type { RootState } from "@/config/config";

const dateFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

export function CustomHeader() {
    const user = useSelector((state: RootState) => state.auth.user)!;

    return (
        <div className="flex justify-between items-center w-full">
            <div className="leading-tight">
                <p className="text-sm font-semibold text-ink">Hi, {user.name}</p>
                <p className="text-xs text-neutral-400">{dateFormatter.format(new Date())}</p>
            </div>

            <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-brand-700">
                    <span className="size-1.5 rounded-full bg-brand-500" />
                    Online
                </span>
                <span className="inline-flex items-center h-7 px-2.5 rounded-full border border-neutral-200 bg-white text-xs font-medium text-neutral-600 capitalize">
                    {user.role}
                </span>
            </div>
        </div>
    )
}
