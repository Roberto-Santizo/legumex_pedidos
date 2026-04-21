import { Modal, CustomFilledButton, useNotification } from "@/features/shared/shared";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { ItemForm, type AddItemForm } from "@/features/my-orders/my-orders";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type Props = {
    client: number;
    transportType: string;
    dc: number;
}

export function ModalEditItem({ client, transportType, dc }: Props) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const id = params.id!;
    const { success, error } = useNotification();
    const queryClient = useQueryClient();

    const queryParams = new URLSearchParams(location.search);
    const itemId = queryParams.get('editItem')!;
    const show = itemId ? true : false;

    const handleCloseModal = () => {
        navigate(location.pathname);
        reset();
    }

    const { mutate, isPending } = useMutation({
        mutationFn: (data: AddItemForm) => ordersProvider.updateOrderItemById(id, itemId, data),
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

    const { data: item } = useQuery({
        queryKey: ['getOrderItemById', itemId],
        queryFn: () => ordersProvider.getOrderItemById(itemId),
        enabled: !!itemId
    });

    const { handleSubmit, register, formState: { errors }, control, reset, setValue } = useForm<AddItemForm>();

    const onSubmit = (data: AddItemForm) => mutate(data);

    useEffect(() => {
        if (item) {
            setValue('product_id', item.product_id.toString());
            setValue('total_boxes', item.total_boxes);
        }
    }, [item]);

    if (item) return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Add Item">
            <div className="p-10">
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <ItemForm register={register} errors={errors} control={control} client={client} transportType={transportType} dc={dc} />

                    <CustomFilledButton
                        label="Update Item"
                        type="submit"
                        disabled={isPending}
                        key={'updateItem'}
                    />
                </form>
            </div>
        </Modal>
    )
}
