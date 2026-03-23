import { clientOptions } from "@/features/clients/clients";
import { clientsProvider } from "@/features/clients/presentation/providers/clientsRepositoryProvider";
import { SelectFormField, TextFormField } from "@/features/shared/shared";
import { useQuery } from "@tanstack/react-query";
import type { CreateOrUpdateProductPayload } from "../../products";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
    register: UseFormRegister<CreateOrUpdateProductPayload>;
    errors: FieldErrors<CreateOrUpdateProductPayload>;
    control: Control<CreateOrUpdateProductPayload, any, CreateOrUpdateProductPayload>;
}

export function Form({ register, errors, control }: Props) {
    const { data: clients } = useQuery({
        queryKey: ['getClients'],
        queryFn: () => clientsProvider.getClients()
    });

    if (clients) return (
        <>
            <TextFormField<CreateOrUpdateProductPayload>
                label="Name"
                name="name"
                placeholder="Product name"
                register={register}
                type="text"
                validation={{ required: 'Product name is Required' }}
                errorMessage={errors.name?.message}
            />

            <TextFormField<CreateOrUpdateProductPayload>
                label="Local Code"
                name="localCode"
                placeholder="Product Local Code"
                register={register}
                type="text"
                validation={{ required: 'Product Local Code is Required' }}
                errorMessage={errors.localCode?.message}
            />

            <TextFormField<CreateOrUpdateProductPayload>
                label="International Code"
                name="internationalCode"
                placeholder="Product International Code"
                register={register}
                type="text"
                validation={{ required: 'Product International Code is Required' }}
                errorMessage={errors.internationalCode?.message}
            />

            <TextFormField<CreateOrUpdateProductPayload>
                label="Price"
                name="price"
                placeholder="Product Price"
                register={register}
                type="number"
                validation={{ required: 'Product Price is Required' }}
                errorMessage={errors.price?.message}
            />

            <TextFormField<CreateOrUpdateProductPayload>
                label="Presentation"
                name="presentation"
                placeholder="Product Presentation"
                register={register}
                type="number"
                validation={{ required: 'Product Presentation is Required' }}
                errorMessage={errors.presentation?.message}
            />

            <TextFormField<CreateOrUpdateProductPayload>
                label="Units Per Box"
                name="units_per_box"
                placeholder="Units per box"
                register={register}
                type="number"
                validation={{ required: 'Units per Box is Required' }}
                errorMessage={errors.units_per_box?.message}
            />

            <SelectFormField<CreateOrUpdateProductPayload>
                label="Client"
                name="client_id"
                options={clientOptions(clients)}
                control={control}
                errorMessage={errors.client_id?.message}
                validation={{ required: 'Client is requierd' }}
            />
        </>
    )
}
