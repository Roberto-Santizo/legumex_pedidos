import { CustomFilledButton } from "@/features/shared/shared";
import { BiDownload, BiSpreadsheet } from "react-icons/bi";

type Props = {
    isLoading: boolean;
    onClick: (flag: string) => void;
    text: string;
    description?: string;
    flag: string;
}

export function ReportCard({ isLoading, onClick, text, description, flag }: Props) {
    return (
        <div className="card p-5 flex flex-col gap-5">
            <div className="flex items-start gap-3">
                <div className="size-10 shrink-0 rounded-xl bg-brand-50 text-brand-600 grid place-items-center">
                    <BiSpreadsheet size={20} />
                </div>
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-ink">{text}</h3>
                    {description && <p className="mt-0.5 text-xs text-neutral-500">{description}</p>}
                </div>
            </div>

            <CustomFilledButton
                disabled={isLoading}
                label="Download .xlsx"
                type="button"
                variant="secondary"
                icon={<BiDownload size={17} />}
                fullWitdh
                className="mt-auto"
                onClick={() => onClick(flag)}
            />
        </div>
    )
}
