import { clientOptions } from "@/features/clients/clients";
import { clientsProvider } from "@/features/clients/presentation/providers/clientsRepositoryProvider";
import { DateFormField, SelectFormField, TextFormField, transportTypes } from "@/features/shared/shared";
import { dcOptions, dcsProvider } from "@/features/dc/dc";
import { useQuery } from "@tanstack/react-query";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { CreateOrderPayload } from "../../my-orders";

type Props = {
    control: Control<CreateOrderPayload, any, CreateOrderPayload>;
    register: UseFormRegister<CreateOrderPayload>;
    errors: FieldErrors<CreateOrderPayload>;
    currentValues: CreateOrderPayload;
}

export function Form({ control, errors, register, currentValues }: Props) {
    const { data: clients } = useQuery({
        queryKey: ['getUserClients'],
        queryFn: () => clientsProvider.getUserClients()
    });

    const { data: dcs } = useQuery({
        queryKey: ['getDcs', currentValues.client_id],
        queryFn: () => dcsProvider.getDcs(`${currentValues.client_id}`),
        enabled: !!currentValues.client_id
    });

    return (
        <>
            <SelectFormField<CreateOrderPayload>
                control={control}
                label="Client"
                name="client_id"
                options={clientOptions(clients ?? [])}
                validation={{ required: 'The client is requierd' }}
                errorMessage={errors.client_id?.message}
            />

            <SelectFormField<CreateOrderPayload>
                control={control}
                label="DC"
                name="dc_id"
                options={dcOptions(dcs ?? [])}
                validation={{ required: 'Dc is requierd' }}
                errorMessage={errors.dc_id?.message}
            />

            <TextFormField<CreateOrderPayload>
                label="PO"
                name="po"
                placeholder="PO information"
                register={register}
                type="text"
                validation={{ required: 'Po is requierd' }}
                errorMessage={errors.po?.message}
            />

            <TextFormField<CreateOrderPayload>
                label="Year"
                name="year"
                placeholder="Year"
                register={register}
                type="number"
                validation={{ required: 'The year is requierd' }}
                errorMessage={errors.year?.message}
            />

            <TextFormField<CreateOrderPayload>
                label="Week"
                name="week"
                placeholder="Week"
                register={register}
                type="number"
                validation={{ required: 'The week is requierd', min: { value: 1, message: 'Min value 1' }, max: { value: 52, message: 'Max value 52' } }}
                errorMessage={errors.week?.message}
            />

            <SelectFormField<CreateOrderPayload>
                control={control}
                label="Transport Type"
                name="transportType"
                options={transportTypes}
                validation={{ required: 'The trasport type is requierd' }}
                errorMessage={errors.client_id?.message}
            />

            <DateFormField<CreateOrderPayload>
                label="Required By"
                name="requiredByDate"
                register={register}
                errorMessage={errors.requiredByDate?.message}
                validation={{ required: 'Date is required' }}
            />
        </>
    )
}
