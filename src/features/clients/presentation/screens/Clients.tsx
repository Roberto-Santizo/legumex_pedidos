import { BiPencil, BiPlus } from "react-icons/bi";
import { clientsProvider } from "../providers/clientsRepositoryProvider";
import { CustomFilledButton, Table, type Column } from "@/features/shared/shared";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { Client } from "@/features/clients/clients";

const columns: Column<Client>[] = [
    { header: 'id', accessor: 'id', id: 'id' },
    { header: 'Name', accessor: 'name', id: 'name' },
    { header: 'Actions',
        id: 'actions',
        render: (_, row) => (
            <Link to={`/clients/update/${row.id}`}>
                <BiPencil size={25} className="hover:text-gray-600" />
            </Link>
        ),
    },
];

export function Clients() {
    const navigate = useNavigate();

    const { data: clients, isLoading } = useQuery({
        queryKey: ['getClients'],
        queryFn: () => clientsProvider.getClients(),
    });

    if (isLoading) return <p>Loading...</p>
    if (clients) return (
        <div>
            <h1 className="main_title">Clients</h1>

            <div className="flex justify-end">
                <CustomFilledButton
                    label="Create"
                    type="button"
                    icon={< BiPlus className="text-white" size={25} />}
                    onClick={() => navigate('/clients/create')}
                />
            </div>

            <Table
                columns={columns}
                data={clients}
            />
        </div>
    )
}
