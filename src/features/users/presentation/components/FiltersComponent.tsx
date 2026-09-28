import { FilterDrawer, SelectFormField, TextFormField } from '@/features/shared/shared';
import React from 'react';
import type { Control, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import type { FiltersUsers } from '@/features/users/users';

type Props = {
    isOpen: boolean;
    toggleMenu: React.Dispatch<React.SetStateAction<boolean>>;
    register: UseFormRegister<FiltersUsers>;
    handleSubmit: UseFormHandleSubmit<FiltersUsers, FiltersUsers>;
    onSubmit: (data: FiltersUsers) => void;
    control: Control<FiltersUsers, any, FiltersUsers>;
    clearFilters: () => void;
}

export function FiltersComponent({ isOpen, toggleMenu, register, handleSubmit, onSubmit, control, clearFilters }: Props) {
    return (
        <FilterDrawer
            isOpen={isOpen}
            onClose={() => toggleMenu(false)}
            onSubmit={handleSubmit((data) => { onSubmit(data); toggleMenu(false); })}
            onClear={clearFilters}
        >
            <TextFormField<FiltersUsers>
                label='Name'
                name='name'
                placeholder='User name'
                register={register}
                type='text'
                validation={{}}
            />

            <TextFormField<FiltersUsers>
                label='Last Name'
                name='lastName'
                placeholder='User last name'
                register={register}
                type='text'
                validation={{}}
            />

            <TextFormField<FiltersUsers>
                label='Email'
                name='email'
                placeholder='User email'
                register={register}
                type='text'
                validation={{}}
            />

            <SelectFormField<FiltersUsers>
                label='Role'
                control={control}
                name='role'
                options={[
                    { value: 'admin', label: 'Admin' },
                    { value: 'client', label: 'Client' },
                    { value: 'administrator', label: 'Administrator' },
                ]}
                validation={{}}
            />
        </FilterDrawer>
    );
}
