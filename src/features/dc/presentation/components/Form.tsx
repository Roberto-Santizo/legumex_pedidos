import { clientOptions } from "@/features/clients/clients";
import { clientsProvider } from "@/features/clients/presentation/providers/clientsRepositoryProvider";
import { SelectFormField, TextFormField } from "@/features/shared/shared";
import { useQuery } from "@tanstack/react-query";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { CreateOrUpdateDc } from "@/features/dc/dc";

type Props = {
  register: UseFormRegister<CreateOrUpdateDc>;
  errors: FieldErrors<CreateOrUpdateDc>;
  control: Control<CreateOrUpdateDc, any, CreateOrUpdateDc>;
}

export function Form({ register, errors, control }: Props) {

  const { data: clients } = useQuery({
    queryKey: ['getClients'],
    queryFn: () => clientsProvider.getClients()
  });

  if (clients) return (
    <>
      <TextFormField<CreateOrUpdateDc>
        label="Name"
        name="name"
        placeholder="DC name"
        register={register}
        type="text"
        validation={{ required: 'The DC name is Required' }}
        errorMessage={errors.name?.message}
      />

      <SelectFormField<CreateOrUpdateDc>
        control={control}
        label="Client"
        name="client_id"
        options={clientOptions(clients)}
        validation={{ required: 'The client is required' }}
        errorMessage={errors.client_id?.message}
      />
    </>
  )
}
