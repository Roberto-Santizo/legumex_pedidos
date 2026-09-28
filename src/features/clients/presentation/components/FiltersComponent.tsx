import { FilterDrawer, TextFormField } from '@/features/shared/shared';
import React from 'react';
import type { UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import type { FiltersClients } from '@/features/clients/clients';

type Props = {
    isOpen: boolean;
    toggleMenu: React.Dispatch<React.SetStateAction<boolean>>;
    register: UseFormRegister<FiltersClients>;
    handleSubmit: UseFormHandleSubmit<FiltersClients, FiltersClients>;
    onSubmit: (data: FiltersClients) => void;
    clearFilters: () => void;
}

export function FiltersComponent({ isOpen, toggleMenu, register, handleSubmit, onSubmit, clearFilters }: Props) {
    return (
        <FilterDrawer
            isOpen={isOpen}
            onClose={() => toggleMenu(false)}
            onSubmit={handleSubmit((data) => { onSubmit(data); toggleMenu(false); })}
            onClear={clearFilters}
        >
            <TextFormField<FiltersClients>
                label='Name'
                name='name'
                placeholder='Client name'
                register={register}
                type='text'
                validation={{}}
            />

            <TextFormField<FiltersClients>
                label='Code'
                name='code'
                placeholder='Client code'
                register={register}
                type='text'
                validation={{}}
            />
        </FilterDrawer>
    );
}
