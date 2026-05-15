// Created by Luis

import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Modal } from '@/features/shared/components/Modal';
import { SelectFormField } from '@/features/shared/components/SelectFormField';
import { dcsProvider } from '@/features/dc/presentation/providers/dcsRepositoryProvider';
import type { Carrier, CreateCarrierPayload } from '../../domain/domain';
import type { Dc } from '@/features/dc/dc';
interface Props {
    open: boolean;
    carrier: Carrier | null;
    saving: boolean;
    onSave: (payload: CreateCarrierPayload, id?: number) => Promise<void>;
    onClose: () => void;
}

interface FormProps {
    carrier: Carrier | null;
    dcs: Dc[];
    saving: boolean;
    onSave: (payload: CreateCarrierPayload, id?: number) => Promise<void>;
    onClose: () => void;
}

interface FormValues {
    name: string;
    shippingCost: string;
    rateUpdatedAt: string;
    dcId: number | string;
}

function CarrierForm({ carrier, dcs, saving, onSave, onClose }: FormProps) {
    const isEdit = carrier !== null;

    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: carrier
            ? {
                  name: carrier.name,
                  shippingCost: String(carrier.shippingCost),
                  rateUpdatedAt: carrier.rateUpdatedAt,
                  dcId: carrier.dcId ?? '',
              }
            : { name: '', shippingCost: '', rateUpdatedAt: '', dcId: '' },
    });

    const dcOptions = dcs.map((dc) => ({ label: `${dc.name} (${dc.code})`, value: dc.id }));

    const onSubmit = async (data: FormValues) => {
        const cost = parseFloat(data.shippingCost);
        if (isNaN(cost) || cost < 0) {
            setError('shippingCost', { message: 'Shipping cost must be a non-negative number.' });
            return;
        }
        try {
            await onSave(
                { name: data.name.trim(), shippingCost: cost, rateUpdatedAt: data.rateUpdatedAt, dcId: Number(data.dcId) },
                isEdit ? carrier.id : undefined,
            );
        } catch (err: unknown) {
            setError('root', { message: err instanceof Error ? err.message : 'An error occurred.' });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {errors.root.message}
                </p>
            )}

            <SelectFormField<FormValues>
                label="Distribution Center"
                name="dcId"
                options={dcOptions}
                control={control}
                validation={{ required: 'Distribution Center is required.' }}
                errorMessage={errors.dcId?.message}
            />

            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Carrier name</label>
                <input
                    type="text"
                    placeholder="e.g. FedEx Freight"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/40"
                    {...register('name', { required: 'Name is required.' })}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Shipping cost (USD)</label>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/40"
                    {...register('shippingCost', { required: 'Shipping cost is required.' })}
                />
                {errors.shippingCost && <p className="text-xs text-red-500">{errors.shippingCost.message}</p>}
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Rate updated date</label>
                <input
                    type="date"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/40"
                    {...register('rateUpdatedAt', { required: 'Rate updated date is required.' })}
                />
                {errors.rateUpdatedAt && <p className="text-xs text-red-500">{errors.rateUpdatedAt.message}</p>}
            </div>

            <div className="flex gap-2 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2 text-sm rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2 text-sm rounded-lg bg-[#00C853] text-white font-semibold hover:bg-[#00b34a] transition-colors disabled:opacity-50"
                >
                    {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create carrier'}
                </button>
            </div>
        </form>
    );
}

// ── Public modal wrapper ───────────────────────────────────────────────────────

export function CarrierFormModal({ open, carrier, saving, onSave, onClose }: Props) {
    const { data: dcs = [] } = useQuery({
        queryKey: ['dcs-all'],
        queryFn: () => dcsProvider.getAllDcs(),
        staleTime: 60_000,
    });

    return (
        <Modal
            modal={open}
            closeModal={onClose}
            title={carrier !== null ? 'Edit carrier' : 'New carrier'}
            width="sm:max-w-md"
        >
            <CarrierForm
                key={`${carrier?.id ?? 'new'}-${open}`}
                carrier={carrier}
                dcs={dcs}
                saving={saving}
                onSave={onSave}
                onClose={onClose}
            />
        </Modal>
    );
}
