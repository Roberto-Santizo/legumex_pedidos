import { BiPencil } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

export function EditButton({ id }: { id: number }) {
    const navigate = useNavigate();
    return (
        <button onClick={() => navigate(`?editOrder=${id}`)} className='hover:cursor-pointer'>
            <BiPencil size={25} />
        </button>
    )
}
