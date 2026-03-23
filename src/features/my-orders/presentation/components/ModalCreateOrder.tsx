import { Modal } from "@/features/shared/shared";
import { useLocation, useNavigate } from "react-router-dom";

export function ModalCreateOrder() {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('createOrder')!;
    const show = modal ? true : false;

    const handleCloseModal = () => {
        navigate(location.pathname);
    }

    return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Create Order">
            <p>aca</p>
        </Modal>
    )
}
