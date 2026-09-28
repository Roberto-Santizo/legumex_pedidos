import Select from "react-select";
import { Controller, type Control, type FieldValues, type Path, type RegisterOptions } from "react-hook-form";
import type { Option } from "../shared";

type Props<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    options: Option[];
    errorMessage?: string;
    control: Control<T>;
    validation: RegisterOptions<T, Path<T>>;
};

export function SelectFormField<T extends FieldValues>({
    label,
    name,
    options,
    errorMessage,
    control,
    validation
}: Props<T>) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="form_label">
                {label}
            </label>

            <Controller
                name={name}
                control={control}
                rules={validation}
                render={({ field }) => (
                    <Select
                        {...field}
                        options={options}
                        isSearchable
                        placeholder="Select an option"
                        classNamePrefix="react-select"
                        value={options.find((opt) => opt.value === field.value) || null}
                        onChange={(selected) => field.onChange(selected?.value)}

                    />
                )}
            />

            <p className="form_error">{errorMessage}</p>
        </div>
    );
}