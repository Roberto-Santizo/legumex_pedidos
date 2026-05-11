import { ItemForm, type AddItemForm } from "@/features/my-orders/my-orders";
import { Modal, CustomFilledButton, useNotification } from "@/features/shared/shared";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { useForm } from "react-hook-form";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
    client: number;
    transportType: string;
    dc: number;
}

export function ModalAddItem({ client, transportType, dc }: Props) {
    const location = useLocation();
    const params = useParams();
    const { success, error } = useNotification();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const id = params.id ?? searchParams.get('editOrderDetails')!;

    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('addItem')!;
    const show = modal ? true : false;

    const handleCloseModal = () => {
        searchParams.delete("addItem");
        setSearchParams(searchParams);
        reset();
    }
    const { mutate, isPending } = useMutation({
        mutationFn: (data: { id: string, payload: AddItemForm }) => ordersProvider.addItemToOrder(data),
        onError: (err) => {
            error(err.message);
        },
        onSuccess: (message) => {
            success(message);
            queryClient.invalidateQueries({ queryKey: ["getOrderTotals", id] });
            queryClient.invalidateQueries({ queryKey: ['getOrderProducts', id] });
            handleCloseModal();
        }
    });

    const { handleSubmit, register, formState: { errors }, control, reset } = useForm<AddItemForm>();

    const onSubmit = (data: AddItemForm) => mutate({ id, payload: data });

    return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Add Item">
            <div className="p-10">
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <ItemForm register={register} control={control} errors={errors} client={client} transportType={transportType} dc={dc} />
                    <CustomFilledButton
                        label="Add Item"
                        type="submit"
                        disabled={isPending}
                        key={'addItem'}
                    />
                </form>
            </div>
        </Modal>
    )
}
