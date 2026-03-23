import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CreateOrUpdateClient } from "@/features/clients/clients";
import { TextFormField } from "@/features/shared/shared";

type Props = {
  register: UseFormRegister<CreateOrUpdateClient>;
  errors: FieldErrors<CreateOrUpdateClient>;
}


export function Form({ register, errors }: Props) {
  return (
    <>
      <TextFormField<CreateOrUpdateClient>
        label="Name"
        name="name"
        placeholder="Client name"
        register={register}
        type="text"
        validation={{ required: 'Client name is Required' }}
        errorMessage={errors.name?.message}
      />
    </>
  )
}
