import { BiMenu, BiPencil, BiPlus } from "react-icons/bi";
import { clientsProvider } from "../providers/clientsRepositoryProvider";
import { CustomFilledButton, Pagination, Table, type Column } from "@/features/shared/shared";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FiltersComponent, type Client, type FiltersClients } from "@/features/clients/clients";

const columns: Column<Client>[] = [
    { header: 'id', accessor: 'id', id: 'id' },
    { header: 'Name', accessor: 'name', id: 'name' },
    { header: 'Code', accessor: 'code', id: 'code' },
    {
        header: 'Actions',
        id: 'actions',
        render: (_, row) => (
            <Link to={`/clients/update/${row.id}`}>
                <BiPencil size={25} className="hover:text-gray-600" />
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

    if (isLoading) return <p>Loading...</p>
    if (clients) return (
        <div className="space-y-5">
            <h1 className="main_title">Clients</h1>

            <div className="flex w-full items-end flex-col gap-5">
                <BiMenu size={40} onClick={() => setOpen(true)} className="cursor-pointer hover:text-gray-500" />

                <CustomFilledButton
                    label="Create"
                    type="button"
                    icon={< BiPlus className="text-white" size={25} />}
                    onClick={() => navigate('/clients/create')}
                />
            </div>

            <Table
                columns={columns}
                data={clients.data.response}
            />

            <Pagination
                count={clients.data.total}
                setSearchParams={setSearchParams}
                page={page}
                rowsPerPage={rowsPerPage}
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
