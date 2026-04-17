import { dcsProvider, type Dc } from "@/features/dc/dc";
import { CustomFilledButton, Table, type Column } from "@/features/shared/shared";
import { useQuery } from "@tanstack/react-query";
import { BiPlus } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const columns: Column<Dc>[] = [
  { header: 'id', accessor: 'id', id: 'id' },
  { header: 'Name', accessor: 'name', id: 'name' },
  { header: 'Client', accessor: 'client', id: 'client' },
  { header: 'Code', accessor: 'code', id: 'code' },
];

export function Dcs() {
  const navigate = useNavigate();

  const { data: dcs, isLoading } = useQuery({
    queryKey: ['getDcs'],
    queryFn: () => dcsProvider.getDcs(''),
  });

  if (isLoading) return <p>Loading...</p>
  if (dcs) return (
    <div>
      <h1 className="main_title">Dcs</h1>

      <div className="flex justify-end">
        <CustomFilledButton
          label="Create Dc"
          type="button"
          icon={<BiPlus className="text-white" size={25} />}
          onClick={() => navigate('/dcs/create')}
        />
      </div>

      <Table
        columns={columns}
        data={dcs}
      />
    </div>
  )
}
