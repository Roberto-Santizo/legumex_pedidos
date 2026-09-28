import { clientOptions } from '@/features/clients/clients';
import { clientsProvider } from '@/features/clients/presentation/providers/clientsRepositoryProvider';
import { FilterDrawer, SelectFormField, TextFormField } from '@/features/shared/shared';
import { dcOptions, dcsProvider } from '@/features/dc/dc';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import type { Control, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import type { OrderFilters } from '../../my-orders';

type Props = {
    isOpen: boolean;
    toggleMenu: React.Dispatch<React.SetStateAction<boolean>>;
    register: UseFormRegister<OrderFilters>;
    handleSubmit: UseFormHandleSubmit<OrderFilters, OrderFilters>;
    onSubmit: (data: OrderFilters) => void;
    control: Control<OrderFilters, any, OrderFilters>;
    clearFilters: () => void;
}

export function FiltersComponent({ isOpen, toggleMenu, register, handleSubmit, onSubmit, clearFilters, control }: Props) {
    const { data: clients } = useQuery({
        queryKey: ['getClients'],
        queryFn: () => clientsProvider.getClients()
    });

    const { data: dcs } = useQuery({
        queryKey: ['dcs'],
        queryFn: () => dcsProvider.getDcs('')
    });


    if (clients && dcs) return (
        <FilterDrawer
            isOpen={isOpen}
            onClose={() => toggleMenu(false)}
            onSubmit={handleSubmit((data) => { onSubmit(data); toggleMenu(false); })}
            onClear={clearFilters}
        >
            <SelectFormField<OrderFilters>
                control={control}
                label="Client"
                name="client"
                options={clientOptions(clients)}
                validation={{}}
            />

            <SelectFormField<OrderFilters>
                control={control}
                label="Dc"
                name="dc"
                options={dcOptions(dcs)}
                validation={{}}
            />

            {/* <SelectFormField<OrderFilters>
                control={control}
                label="Transport Type"
                name="transportType"
                options={transportTypes}
                validation={{}}
            /> */}

            <TextFormField<OrderFilters>
                label='Po'
                name='po'
                placeholder='PO'
                register={register}
                type='text'
                validation={{}}
            />

            <TextFormField<OrderFilters>
                label='Week'
                name='week'
                placeholder='Week of order'
                register={register}
                type='number'
                validation={{}}
            />

            <TextFormField<OrderFilters>
                label='Year'
                name='year'
                placeholder='Year of order'
                register={register}
                type='number'
                validation={{}}
            />
        </FilterDrawer>
    );
}