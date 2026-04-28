import { clientOptions } from "@/features/clients/clients";
import { clientsProvider } from "@/features/clients/presentation/providers/clientsRepositoryProvider";
import { CustomFilledButton, DateFormField, Modal, SelectFormField, useNotification, transportTypes, TextFormField } from "@/features/shared/shared";
import { dcOptions, dcsProvider } from "@/features/dc/dc";
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

    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        reset,
        watch,
    } = useForm<CreateOrderPayload>();

    const currentValues = watch();

    const { data: clients } = useQuery({
        queryKey: ['getUserClients'],
        queryFn: () => clientsProvider.getUserClients()
    });

    const { data: dcs } = useQuery({
        queryKey: ['getDcs', currentValues.client_id],
        queryFn: () => dcsProvider.getDcs(currentValues.client_id),
        enabled: !!currentValues.client_id
    });


    const onSubmit = (data: CreateOrderPayload) => mutate(data);

    if (clients) return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Create Order">
            <form className="form mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <SelectFormField<CreateOrderPayload>
                    control={control}
                    label="Client"
                    name="client_id"
                    options={clientOptions(clients)}
                    validation={{ required: 'The client is requierd' }}
                    errorMessage={errors.client_id?.message}
                />

                <SelectFormField<CreateOrderPayload>
                    control={control}
                    label="DC"
                    name="dc_id"
                    options={dcOptions(dcs ?? [])}
                    validation={{ required: 'Dc is requierd' }}
                    errorMessage={errors.dc_id?.message}
                />

                <TextFormField<CreateOrderPayload>
                    label="PO"
                    name="po"
                    placeholder="PO information"
                    register={register}
                    type="text"
                    validation={{ required: 'Po is requierd' }}
                    errorMessage={errors.po?.message}
                />

                <TextFormField<CreateOrderPayload>
                    label="Year"
                    name="year"
                    placeholder="Year"
                    register={register}
                    type="number"
                    validation={{ required: 'The year is requierd' }}
                    errorMessage={errors.year?.message}
                />

                <TextFormField<CreateOrderPayload>
                    label="Week"
                    name="week"
                    placeholder="Week"
                    register={register}
                    type="number"
                    validation={{ required: 'The week is requierd' }}
                    errorMessage={errors.week?.message}
                />

                <SelectFormField<CreateOrderPayload>
                    control={control}
                    label="Transport Type"
                    name="transportType"
                    options={transportTypes}
                    validation={{ required: 'The trasport type is requierd' }}
                    errorMessage={errors.client_id?.message}
                />

                <DateFormField<CreateOrderPayload>
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
