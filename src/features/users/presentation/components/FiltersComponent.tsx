import { BiTrash } from 'react-icons/bi';
import { CustomFilledButton, SelectFormField, TextFormField } from '@/features/shared/shared';
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
        <>
            {isOpen && (
                <div className="fixed inset-0 z-40 " onClick={() => toggleMenu(!isOpen)} aria-hidden="true" />
            )}

            <aside className={`shadow-2xl fixed top-0 right-0 z-50 h-screen p-4 overflow-y-auto transition-transform bg-white w-80  ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button onClick={() => toggleMenu(!isOpen)} className="text-gray-500 hover:text-black cursor-pointer">
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <form className='form' onSubmit={handleSubmit(onSubmit)}>
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

                        <div className='grid grid-cols-6 items-center gap-5'>
                            <CustomFilledButton
                                label='Filter data'
                                type='submit'
                                className=' col-span-5'
                            />
                            <BiTrash className='cursor-pointer hover:text-gray-500' onClick={() => clearFilters()} size={25} />
                        </div>
                    </form>
                </div>
            </aside>
        </>
    );
}
