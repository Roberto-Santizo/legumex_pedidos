import { BiPencil, BiPlus } from "react-icons/bi";
import { clientsProvider } from "../providers/clientsRepositoryProvider";
import { CustomFilledButton, FilterButton, LoadingState, PageHeader, Pagination, Table, type Column } from "@/features/shared/shared";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FiltersComponent, type Client, type FiltersClients } from "@/features/clients/clients";

const columns: Column<Client>[] = [
    { header: 'ID', accessor: 'id', id: 'id', render: (value) => <span className="font-mono text-xs text-neutral-400">#{value}</span> },
    { header: 'Name', accessor: 'name', id: 'name', render: (value) => <span className="font-medium text-ink">{value}</span> },
    { header: 'Code', accessor: 'code', id: 'code' },
    {
        header: 'Actions',
        id: 'actions',
        render: (_, row) => (
            <Link to={`/clients/update/${row.id}`} className="icon_btn" title="Edit">
                <BiPencil size={17} />
            </Link>
        ),
    },
];

const initialFilters: FiltersClients = { name: '', code: '' };

export function Clients() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [open, setOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<FiltersClients>(initialFilters);

    const page = Number(searchParams.get("page")) || 0;
    const rowsPerPage = Number(searchParams.get("limit")) || 10;

    const { data: clients, isLoading } = useQuery({
        queryKey: ['getPaginatedClients', rowsPerPage, page, filters],
        queryFn: () => clientsProvider.getPaginatedClients({ limit: rowsPerPage, offset: page + 1, filters }),
    });

    const { handleSubmit, register, reset } = useForm<FiltersClients>({ defaultValues: initialFilters });

    const onSubmit = (data: FiltersClients) => {
        setFilters(data);
    }

    const clearFilters = () => {
        setFilters(initialFilters);
        reset();
    }

    if (isLoading) return <LoadingState />
    if (clients) return (
        <div className="space-y-6">
            <PageHeader
                title="Clients"
                description="Manage the clients orders are placed for."
                actions={
                    <>
                        <FilterButton onClick={() => setOpen(true)} />
                        <CustomFilledButton
                            label="New client"
                            type="button"
                            icon={<BiPlus size={18} />}
                            onClick={() => navigate('/clients/create')}
                        />
                    </>
                }
            />

            <Table
                columns={columns}
                data={clients.data.response}
                footer={
                    <Pagination
                        count={clients.data.total}
                        setSearchParams={setSearchParams}
                        page={page}
                        rowsPerPage={rowsPerPage}
                    />
                }
            />

            <FiltersComponent
                isOpen={open}
                toggleMenu={setOpen}
                handleSubmit={handleSubmit}
                register={register}
                onSubmit={onSubmit}
                clearFilters={clearFilters}
            />
        </div>
    )
}
