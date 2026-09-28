import { clientsProvider } from '../providers/clientsRepositoryProvider';
import { CustomFilledButton, PageHeader, useNotification } from '@/features/shared/shared';
import { Form } from "../presentation";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { CreateOrUpdateClient } from "@/features/clients/clients";

export function CreateClient() {
    const notification = useNotification();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (data: { code: string, name: string }) => clientsProvider.createClient(data.name, data.code),
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
        formState: { errors }
    } = useForm<CreateOrUpdateClient>();

    const onSubmit = (data: CreateOrUpdateClient) => mutate({ name: data.name, code: data.code });

    return (
        <div className="space-y-6">
            <PageHeader title="New client" description="Register a new client." backTo="/clients" />

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
