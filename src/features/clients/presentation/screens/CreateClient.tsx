import { clientsProvider } from '../providers/clientsRepositoryProvider';
import { CustomFilledButton, useNotification } from '@/features/shared/shared';
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
        mutationFn: (name: string) => clientsProvider.createClient(name),
        onError: (err) => {
            notification.error(err.message);
        },
        onSuccess: (message) => {
            notification.success(message);
            navigate('/clients');
            queryClient.invalidateQueries({ queryKey: ['getClients'] });
        }
    });

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<CreateOrUpdateClient>();

    const onSubmit = (data: CreateOrUpdateClient) => mutate(data.name);

    return (
        <div className="space-y-5">
            <h1 className="main_title">Create Client</h1>

            <form className="form mx-auto w-3/4" onSubmit={handleSubmit(onSubmit)}>
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
