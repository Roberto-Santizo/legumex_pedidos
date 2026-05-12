import { CustomFilledButton, Modal, useNotification } from "@/features/shared/shared";
import { Form, type CreateOrderPayload, type OrderFilters } from "../../my-orders";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
    filters: OrderFilters;
}

export function ModalEditOrder({ filters }: Props) {
    const location = useLocation();
    const notification = useNotification();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 0;
    const rowsPerPage = Number(searchParams.get("limit")) || 10;

    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('editOrder')!;
    const show = id ? true : false;

    const { data } = useQuery({
        queryKey: ['getOrderEditDetails', id],
        queryFn: () => ordersProvider.getOrderEditDetailsById(id),
        enabled: !!id
    });

    const handleCloseModal = () => {
        searchParams.delete('editOrder');
        setSearchParams(searchParams);
    }

    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
        watch,
        setValue,
        reset
    } = useForm<CreateOrderPayload>();

    const { mutate, isPending } = useMutation({
        mutationFn: (data: CreateOrderPayload) => ordersProvider.updateOrderById(id, data),
        onError: (err) => {
            notification.error(err.message);
        },
        onSuccess: (message) => {
            notification.success(message);
            handleCloseModal();
            queryClient.invalidateQueries({ queryKey: ['getMyOrders', rowsPerPage, page, filters] })
            reset();
        }
    });

    const currentValues = watch();

    useEffect(() => {
        if (data) {
            setValue('client_id', data.client_id);
            setValue('dc_id', data.dc_id);
            setValue('po', data.po);
            setValue('week', data.week);
            setValue('year', data.year);
            setValue('transportType', data.transportType);
            setValue('requiredByDate', data.requiredByDate);
        }
    }, [data]);

    const onSubmit = (data: CreateOrderPayload) => mutate(data);

    if (data) return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Update Order">
            <form className="form mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <Form register={register} control={control} errors={errors} currentValues={currentValues} />

                <CustomFilledButton
                    label="Update"
                    type="submit"
                    disabled={isPending}
                />
            </form>
        </Modal>
    )
}
