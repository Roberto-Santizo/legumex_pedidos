import { BiPencil } from 'react-icons/bi';
import { useSearchParams } from 'react-router-dom';

export function EditButton({ id }: { id: number }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleOpenEditModal = () => {
        searchParams.set('editOrder', id.toString());
        setSearchParams(searchParams);
    }
    
    return (
        <button onClick={() => handleOpenEditModal()} className='icon_btn' title='Edit'>
            <BiPencil size={17} />
        </button>
    )
}
