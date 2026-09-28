import type { Path, PathValue, RegisterOptions, UseFormRegister } from "react-hook-form";

type Props<T extends Record<string, any>> = {
    label: string;
    name: Path<T>;
    placeholder: string;
    type: string;
    errorMessage?: string;
    register: UseFormRegister<T>;
    validation: RegisterOptions<T, Path<T>>;
    value?: PathValue<T, Path<T>>
}


export function TextFormField<T extends Record<string, any>>({ label, name, placeholder, type, errorMessage, register, validation, value }: Props<T>) {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                className="form_label"
                htmlFor={name}
            >
                {label}
            </label>

            <input
                {...register(name, validation)}
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                autoComplete="off"
                className={errorMessage ? 'text_form_field_error' : 'text_form_field'}
                value={value}
            />
            <p className="form_error">{errorMessage}</p>
        </div>
    )
}
