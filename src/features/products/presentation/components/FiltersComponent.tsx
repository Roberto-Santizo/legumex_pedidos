import { clientOptions } from '@/features/clients/clients';
import { clientsProvider } from '@/features/clients/presentation/providers/clientsRepositoryProvider';
import { FilterDrawer, SelectFormField, TextFormField, transportTypes } from '@/features/shared/shared';
import { dcOptions, dcsProvider } from '@/features/dc/dc';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import type { Control, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import type { FiltersProducts } from '@/features/products/products';

type Props = {
    isOpen: boolean;
    toggleMenu: React.Dispatch<React.SetStateAction<boolean>>;
    register: UseFormRegister<FiltersProducts>;
    handleSubmit: UseFormHandleSubmit<FiltersProducts, FiltersProducts>;
    onSubmit: (data: FiltersProducts) => void;
    control: Control<FiltersProducts, any, FiltersProducts>;
    clearFilters: () => void;
}

export function FiltersComponent({ isOpen, toggleMenu, register, handleSubmit, onSubmit, control, clearFilters }: Props) {
    const { data: clients } = useQuery({
        queryKey: ['getClients'],
        queryFn: () => clientsProvider.getClients()
    });

    const { data: dcs } = useQuery({
        queryKey: ['getDcs'],
        queryFn: () => dcsProvider.getDcs('')
    });

    if (clients && dcs) return (
        <FilterDrawer
            isOpen={isOpen}
            onClose={() => toggleMenu(false)}
            onSubmit={handleSubmit((data) => { onSubmit(data); toggleMenu(false); })}
            onClear={clearFilters}
        >
            <TextFormField<FiltersProducts>
                label='Name'
                name='name'
                placeholder='Product name'
                register={register}
                type='text'
                validation={{}}
            />

            <TextFormField<FiltersProducts>
                label='Local Code'
                name='localCode'
                placeholder='Local Code of Product'
                register={register}
                type='text'
                validation={{}}
            />

            <TextFormField<FiltersProducts>
                label='International Code'
                name='internationalCode'
                placeholder='International Code of Product'
                register={register}
                type='text'
                validation={{}}
            />

            <SelectFormField<FiltersProducts>
                control={control}
                label="DC"
                name="dc"
                options={dcOptions(dcs)}
                validation={{}}
            />

            <SelectFormField<FiltersProducts>
                control={control}
                label="Transport Type"
                name="transportType"
                options={transportTypes}
                validation={{}}
            />

            <SelectFormField<FiltersProducts>
                label='Client'
                control={control}
                name='client'
                options={clientOptions(clients)}
                validation={{}}
            />
        </FilterDrawer>
    );
}