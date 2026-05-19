import { EditOrderDetails } from "./EditOrderDetails";
import { Modal } from "@/features/shared/shared";
import { OrderTotalsComponent } from "../presentation";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export function ModalEditOrderDetails() {
    const [searchParams, setSearchParams] = useSearchParams();

    const id = searchParams.get("editOrderDetails")!!;
    const show = !!id;

    const handleCloseModal = () => {
        searchParams.delete("editOrderDetails");
        setSearchParams(searchParams);
    };

    const { data: totals } = useQuery({
        queryKey: ["getOrderTotals", id],
        queryFn: () => ordersProvider.getOrderTotals(id),
        enabled: !!id,
    });

    if (id && totals) return (
        <Modal modal={show} closeModal={handleCloseModal} title="Update Order" width="w-1/2">
            <OrderTotalsComponent totals={totals} />

            <EditOrderDetails id={id} />
        </Modal>
    );
}