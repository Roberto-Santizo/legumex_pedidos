import { BiTrash } from 'react-icons/bi';
import { clientOptions } from '@/features/clients/clients';
import { clientsProvider } from '@/features/clients/presentation/providers/clientsRepositoryProvider';
import { CustomFilledButton, SelectFormField, TextFormField } from '@/features/shared/shared';
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
