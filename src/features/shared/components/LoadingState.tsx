type Props = {
    label?: string;
    fullScreen?: boolean;
};

export function LoadingState({ label = 'Loading...', fullScreen = false }: Props) {
    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${fullScreen ? 'h-screen bg-canvas' : 'py-24'}`}>
            <span className="size-7 rounded-full border-[3px] border-neutral-200 border-t-brand-500 animate-spin" />
            <p className="text-sm text-neutral-500">{label}</p>
        </div>
    );
}
