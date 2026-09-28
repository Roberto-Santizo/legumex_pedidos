import { clientOptions } from '@/features/clients/clients';
import { clientsProvider } from '@/features/clients/presentation/providers/clientsRepositoryProvider';
import { FilterDrawer, SelectFormField, TextFormField } from '@/features/shared/shared';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import type { Control, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import type { FiltersDcs } from '@/features/dc/dc';

type Props = {
    isOpen: boolean;
    toggleMenu: React.Dispatch<React.SetStateAction<boolean>>;
    register: UseFormRegister<FiltersDcs>;
    handleSubmit: UseFormHandleSubmit<FiltersDcs, FiltersDcs>;
    onSubmit: (data: FiltersDcs) => void;
    control: Control<FiltersDcs, any, FiltersDcs>;
    clearFilters: () => void;
}

export function FiltersComponent({ isOpen, toggleMenu, register, handleSubmit, onSubmit, control, clearFilters }: Props) {
    const { data: clients } = useQuery({
        queryKey: ['getClients'],
        queryFn: () => clientsProvider.getClients()
    });

    if (clients) return (
        <FilterDrawer
            isOpen={isOpen}
            onClose={() => toggleMenu(false)}
            onSubmit={handleSubmit((data) => { onSubmit(data); toggleMenu(false); })}
            onClear={clearFilters}
        >
            <TextFormField<FiltersDcs>
                label='Name'
                name='name'
                placeholder='DC name'
                register={register}
                type='text'
                validation={{}}
            />

            <TextFormField<FiltersDcs>
                label='Code'
                name='code'
                placeholder='DC code'
                register={register}
                type='text'
                validation={{}}
            />

            <TextFormField<FiltersDcs>
                label='Warehouse'
                name='warehouse'
                placeholder='DC warehouse'
                register={register}
                type='text'
                validation={{}}
            />

            <SelectFormField<FiltersDcs>
                label='Client'
                control={control}
                name='client'
                options={clientOptions(clients)}
                validation={{}}
            />
        </FilterDrawer>
    );
}
