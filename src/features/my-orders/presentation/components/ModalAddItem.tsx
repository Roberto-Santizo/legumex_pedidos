import { Modal, TextFormField, CustomFilledButton, SelectFormField, useNotification } from "@/features/shared/shared";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { productsProvider } from "@/features/products/products";
import { productsToOptions, type AddItemForm } from "../../my-orders";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
    client: number;
    transportType: string;
}

export function ModalAddItem({ client, transportType }: Props) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const id = params.id!;
    const { success, error } = useNotification();
    const queryClient = useQueryClient();

    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('addItem')!;
    const show = modal ? true : false;

    const handleCloseModal = () => {
        navigate(location.pathname);
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

    const { data: products, isLoading } = useQuery({
        queryKey: ['getProducts', client, transportType],
        queryFn: () => productsProvider.getProducts(client, transportType),
    });

    const { handleSubmit, register, formState: { errors }, control, reset } = useForm<AddItemForm>();

    const onSubmit = (data: AddItemForm) => mutate({ id, payload: data });

    if (isLoading) return <p>Loading...</p>

    if (products) return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Add Item">
            <div className="p-10">
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <SelectFormField<AddItemForm>
                        label="Product"
                        name="product_id"
                        options={productsToOptions(products)}
                        control={control}
                        errorMessage={errors.product_id?.message}
                        validation={{ required: 'Product is requierd' }}
                    />
                    <TextFormField<AddItemForm>
                        label="Boxes"
                        name="total_boxes"
                        placeholder="Total boxes"
                        register={register}
                        type="number"
                        validation={{ required: 'Total Boxes are required' }}
                        errorMessage={errors.total_boxes?.message}
                    />

                    <TextFormField<AddItemForm>
                        label="PO"
                        name="po"
                        placeholder="PO information"
                        register={register}
                        type="text"
                        validation={{ required: 'PO is required' }}
                        errorMessage={errors.po?.message}
                    />

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
