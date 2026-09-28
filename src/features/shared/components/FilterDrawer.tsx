import type { FormEventHandler, ReactNode } from "react";
import { BiFilterAlt, BiX } from "react-icons/bi";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: FormEventHandler<HTMLFormElement>;
    onClear: () => void;
    children: ReactNode;
    title?: string;
};

export function FilterDrawer({ isOpen, onClose, onSubmit, onClear, children, title = 'Filters' }: Props) {
    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-neutral-900/30 backdrop-blur-[2px] transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            />

            <aside className={`fixed top-0 right-0 z-50 h-screen w-96 max-w-full flex flex-col bg-white border-l border-neutral-200 shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center h-16 px-6 border-b border-neutral-200/80">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-lg bg-brand-50 text-brand-600 grid place-items-center">
                            <BiFilterAlt size={16} />
                        </div>
                        <h2 className="text-base font-semibold text-ink">{title}</h2>
                    </div>
                    <button type="button" onClick={onClose} className="icon_btn">
                        <BiX size={20} />
                    </button>
                </div>

                <form className="flex-1 flex flex-col min-h-0" onSubmit={onSubmit}>
                    <div className="flex-1 overflow-y-auto thin_scroll px-6 py-6 space-y-3">
                        {children}
                    </div>

                    <div className="flex gap-2 px-6 py-4 border-t border-neutral-200/80 bg-neutral-50/60">
                        <button type="button" className="btn btn_secondary flex-1" onClick={onClear}>
                            Clear
                        </button>
                        <button type="submit" className="btn btn_primary flex-1">
                            Apply filters
                        </button>
                    </div>
                </form>
            </aside>
        </>
    );
}

export function FilterButton({ onClick }: { onClick: () => void }) {
    return (
        <button type="button" className="btn btn_secondary" onClick={onClick}>
            <BiFilterAlt size={16} />
            Filters
        </button>
    );
}
