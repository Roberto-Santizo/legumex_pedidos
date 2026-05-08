import { CustomFilledButton, Modal, useNotification } from "@/features/shared/shared";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { Form, type CreateOrderPayload } from "@/features/my-orders/my-orders";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function ModalCreateOrder() {
    const navigate = useNavigate();
    const location = useLocation();
    const notification = useNotification();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 0;
    const rowsPerPage = Number(searchParams.get("limit")) || 10;

    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('createOrder')!;
    const show = modal ? true : false;

    const handleCloseModal = () => {
        const params = new URLSearchParams(location.search);
        params.delete("createOrder");

        navigate({
            pathname: location.pathname,
            search: params.toString(),
        });
        reset();
    }

    const { mutate, isPending } = useMutation({
        mutationFn: (payload: CreateOrderPayload) => ordersProvider.createOrder(payload),
        onError: (err) => {
            notification.error(err.message);
        },
        onSuccess: (message) => {
            notification.success(message);
            handleCloseModal();
            queryClient.invalidateQueries({ queryKey: ['getMyOrders', rowsPerPage, page] })
        }
    });

    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        reset,
        watch,
    } = useForm<CreateOrderPayload>();

    const currentValues = watch();

    const onSubmit = (data: CreateOrderPayload) => mutate(data);

    return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Create Order">
            <form className="form mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <Form register={register} control={control} errors={errors} currentValues={currentValues} />

                <CustomFilledButton
                    label="Create"
                    type="submit"
                    disabled={isPending}
                />
            </form>
        </Modal>
    )
}
