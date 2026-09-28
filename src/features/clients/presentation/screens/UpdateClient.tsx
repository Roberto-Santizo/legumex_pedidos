import { clientsProvider } from "../providers/clientsRepositoryProvider";
import { CustomFilledButton, LoadingState, PageHeader, useNotification } from "@/features/shared/shared";
import { Form } from "../presentation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import type { CreateOrUpdateClient } from "@/features/clients/clients";

export function UpdateClient() {
    const params = useParams();
    const id = params.id!!;
    const notification = useNotification();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: client, isLoading } = useQuery({
        queryKey: ['getClientById', id],
        queryFn: () => clientsProvider.getClientById(id)
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: { id: string, name: string }) => clientsProvider.updateClientById(data),
        onError: (err) => {
            notification.error(err.message);
        },
        onSuccess: (message) => {
            notification.success(message);
            navigate('/clients');
            queryClient.invalidateQueries({ queryKey: ['getClients'] });
            queryClient.invalidateQueries({ queryKey: ['getPaginatedClients'] });
        }
    });

    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue
    } = useForm<CreateOrUpdateClient>();

    useEffect(() => {
        if (client) {
            setValue('name', client.name);
        }
    }, [client]);

    const onSubmit = ({ name }: CreateOrUpdateClient) => mutate({ id, name })

    if (isLoading) return <LoadingState />
    if (client) return (
        <div>
            <PageHeader title="Edit client" description="Update client information." backTo="/clients" />

            <form className="form max-w-3xl" onSubmit={handleSubmit(onSubmit)}>
                <Form register={register} errors={errors} />

                <CustomFilledButton
                    disabled={isPending}
                    label="Create"
                    type="submit"
                    fullWitdh={true}
                />
            </form>
        </div>
    )
}
