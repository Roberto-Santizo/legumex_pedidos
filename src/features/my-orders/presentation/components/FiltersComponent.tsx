import { BiTrash } from 'react-icons/bi';
import { clientOptions } from '@/features/clients/clients';
import { clientsProvider } from '@/features/clients/presentation/providers/clientsRepositoryProvider';
import { CustomFilledButton, SelectFormField, TextFormField } from '@/features/shared/shared';
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