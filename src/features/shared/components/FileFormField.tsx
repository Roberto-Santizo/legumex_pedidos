import type { Path, RegisterOptions, UseFormRegister } from "react-hook-form";

type Props<T extends Record<string, any>> = {
    label: string;
    name: Path<T>;
    errorMessage?: string;
    register: UseFormRegister<T>;
    validation?: RegisterOptions<T, Path<T>>;
    accept?: string;
    multiple?: boolean;
};

export function FileFormField<T extends Record<string, any>>({
    name,
    errorMessage,
    register,
    validation,
    accept,
    multiple = false
}: Props<T>) {
    return (
        <div className="flex flex-col gap-2">
            <input
                {...register(name, validation)}
                id={name}
                type="file"
                accept={accept}
                multiple={multiple}
                className={errorMessage ? 'text_form_field_error' : 'text_form_field'}
            />

            <p className="text-red-400 text-xs">{errorMessage}</p>
        </div>
    );
}