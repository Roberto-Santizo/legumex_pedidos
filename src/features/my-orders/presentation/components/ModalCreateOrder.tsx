import { clientOptions } from "@/features/clients/clients";
import { clientsProvider } from "@/features/clients/presentation/providers/clientsRepositoryProvider";
import { CustomFilledButton, DateFormField, Modal, SelectFormField, TextFormField, useNotification, transportTypes } from "@/features/shared/shared";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { type CreateOrderPayload } from "@/features/my-orders/my-orders";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function ModalCreateOrder() {
    const navigate = useNavigate();
    const location = useLocation();
    const notification = useNotification();
    const queryClient = useQueryClient();
    const [searchParams, _] = useSearchParams();

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

    const { data: clients } = useQuery({
        queryKey: ['getUserClients'],
        queryFn: () => clientsProvider.getUserClients()
    });

    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        reset
    } = useForm<CreateOrderPayload>();

    const onSubmit = (data: CreateOrderPayload) => mutate(data);

    if (clients) return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Create Order">
            <form className="form mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <TextFormField
                    label="DC"
                    name="dc"
                    placeholder="Order dc"
                    register={register}
                    type="text"
                    validation={{ required: 'The DC is required' }}
                    errorMessage={errors.dc?.message}
                />

                <SelectFormField
                    control={control}
                    label="Client"
                    name="client_id"
                    options={clientOptions(clients)}
                    validation={{ required: 'The client is requierd' }}
                    errorMessage={errors.client_id?.message}
                />

                <SelectFormField
                    control={control}
                    label="Transport Type"
                    name="transportType"
                    options={transportTypes}
                    validation={{ required: 'The trasport type is requierd' }}
                    errorMessage={errors.client_id?.message}
                />

                <DateFormField
                    label="Required By"
                    name="requiredByDate"
                    register={register}
                    errorMessage={errors.requiredByDate?.message}
                    validation={{ required: 'Date is required' }}
                />

                <CustomFilledButton
                    label="Create"
                    type="submit"
                    disabled={isPending}
                />
            </form>
        </Modal>
    )
}
