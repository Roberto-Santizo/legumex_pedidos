// Created by Luis

import { useQuery } from '@tanstack/react-query';
import { Modal } from '@/features/shared/components/Modal';
import { carriersProvider } from '../providers/carriersRepositoryProvider';
import type { Carrier, CarrierRate } from '../../domain/domain';

interface Props {
    carrier: Carrier | null;
    open: boolean;
    onClose: () => void;
}

function RateRow({ rate, prev, isCurrent }: { rate: CarrierRate; prev: CarrierRate | null; isCurrent: boolean }) {
    const diff = prev ? rate.cost - prev.cost : null;
    const pct = prev && prev.cost !== 0 ? ((diff! / prev.cost) * 100) : null;

    const trendColor = diff === null ? '' : diff > 0 ? 'text-red-500' : diff < 0 ? 'text-emerald-500' : 'text-slate-400';
    const trendArrow = diff === null ? null : diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
    const bgClass = isCurrent ? 'bg-[#00C853]/6 border-l-2 border-[#00C853]' : 'hover:bg-slate-50/70';

    return (
        <tr className={`transition-colors ${bgClass}`}>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">{rate.effectiveDate}</span>
                    {isCurrent && (
                        <span className="text-[10px] font-bold bg-[#00C853] text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                            actual
                        </span>
                    )}
                </div>
            </td>
            <td className="px-4 py-3 text-right">
                <span className="font-semibold text-slate-800 text-sm">
                    ${rate.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </td>
            <td className="px-4 py-3 text-right">
                {diff !== null ? (
                    <div className={`flex items-center justify-end gap-1 text-xs font-semibold ${trendColor}`}>
                        <span>{trendArrow}</span>
                        <span>
                            ${Math.abs(diff).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        {pct !== null && (
                            <span className="text-[11px] opacity-70">({pct > 0 ? '+' : ''}{pct.toFixed(1)}%)</span>
                        )}
                    </div>
                ) : (
                    <span className="text-xs text-slate-300">—</span>
                )}
            </td>
        </tr>
    );
}

function TrendSummary({ rates }: { rates: CarrierRate[] }) {
    if (rates.length < 2) return null;

    const current = rates[0].cost;
    const oldest = rates[rates.length - 1].cost;
    const totalChange = current - oldest;
    const totalPct = oldest !== 0 ? (totalChange / oldest) * 100 : 0;
    const min = Math.min(...rates.map((r) => r.cost));
    const max = Math.max(...rates.map((r) => r.cost));

    return (
        <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-slate-50 rounded-xl px-3 py-2.5 text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Mínimo histórico</p>
                <p className="text-sm font-bold text-emerald-600">
                    ${min.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2.5 text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Máximo histórico</p>
                <p className="text-sm font-bold text-red-500">
                    ${max.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2.5 text-center">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Cambio total</p>
                <p className={`text-sm font-bold ${totalChange > 0 ? 'text-red-500' : totalChange < 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {totalChange >= 0 ? '+' : ''}${totalChange.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    <span className="text-[11px] font-medium ml-1 opacity-80">
                        ({totalPct >= 0 ? '+' : ''}{totalPct.toFixed(1)}%)
                    </span>
                </p>
            </div>
        </div>
    );
}

export function CarrierRateHistoryModal({ carrier, open, onClose }: Props) {
    const { data: rates = [], isLoading } = useQuery({
        queryKey: ['carrier-rates', carrier?.id],
        queryFn: () => carriersProvider.getRates(carrier!.id),
        enabled: open && carrier !== null,
        staleTime: 30_000,
    });

    return (
        <Modal
            modal={open}
            closeModal={onClose}
            title={carrier ? `Historial de tarifas — ${carrier.name}` : 'Historial de tarifas'}
            width="sm:max-w-lg"
        >
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-slate-400">Cargando historial...</p>
                </div>
            )}

            {!isLoading && rates.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                    <p className="text-sm font-semibold text-slate-500">Sin historial de tarifas</p>
                    <p className="text-xs text-slate-400">Las tarifas se registran automáticamente al crear o actualizar un transportista.</p>
                </div>
            )}

            {!isLoading && rates.length > 0 && (
                <>
                    <TrendSummary rates={rates} />

                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Fecha</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Tarifa</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Variación</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rates.map((rate, idx) => (
                                    <RateRow
                                        key={rate.id}
                                        rate={rate}
                                        prev={rates[idx + 1] ?? null}
                                        isCurrent={idx === 0}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </Modal>
    );
}
