import type { Path, PathValue, RegisterOptions, UseFormRegister } from "react-hook-form";
import type { Option } from "../shared";

type Props<T extends Record<string, any>> = {
    label: string;
    name: Path<T>;
    options: Option[];
    errorMessage?: string;
    register: UseFormRegister<T>;
    validation?: RegisterOptions<T, Path<T>>;
    defaultValues?: PathValue<T, Path<T>>;
};

export function CheckboxListFormField<T extends Record<string, any>>({
    label,
    name,
    options,
    errorMessage,
    register,
    validation
}: Props<T>) {
    return (
        <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-gray-800">
                {label}
            </span>

            <div className={`flex flex-col gap-2 rounded-xl border p-3 transition ${errorMessage
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'}
                    `}>
                {options.map((option) => (
                    <label
                        key={option.value}
                        className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition hover:bg-gray-50"
                    >
                        <input
                            type="checkbox"
                            value={option.value}
                            {...register(name, validation)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 
                               focus:ring-2 focus:ring-blue-500 transition"
                        />

                        <span className="text-sm text-gray-700">
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>

            {errorMessage && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}