import { useSearchParams } from "react-router-dom";
import { Modal } from "@/features/shared/shared";
import { EditOrderDetails } from "./EditOrderDetails";

export function ModalEditOrderDetails() {
    const [searchParams, setSearchParams] = useSearchParams();

    const id = searchParams.get("editOrderDetails");
    const show = !!id;

    const handleCloseModal = () => {
        searchParams.delete("editOrderDetails");
        setSearchParams(searchParams);
    };

    if (id) return (
        <Modal modal={show} closeModal={handleCloseModal} title="Update Order" width="w-1/2">
            <EditOrderDetails id={id} />
        </Modal>
    );
}