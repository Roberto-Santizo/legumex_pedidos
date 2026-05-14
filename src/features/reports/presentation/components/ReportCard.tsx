import { CustomFilledButton } from "@/features/shared/shared";
import { BiFile } from "react-icons/bi";

type Props = {
    isLoading: boolean;
    onClick: (flag: string) => void;
    text: string;
    flag: string;
}

export function ReportCard({ isLoading, onClick, text, flag }: Props) {
    return (
        <div className="group bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between hover:-translate-y-1">
            <div className="flex flex-col justify-center items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5">
                    <BiFile className="w-7 h-7 text-emerald-600" />
                </div>

                <h3 className="text-xl font-semibold text-gray-800">
                    {text}
                </h3>
            </div>

            <div className="mt-6">
                <CustomFilledButton
                    disabled={isLoading}
                    label={isLoading ? "Downloading..." : "Download Report"}
                    type="button"
                    className="w-full rounded-xl h-11"
                    onClick={() => onClick(flag)}
                />
            </div>
        </div>
    )
}
