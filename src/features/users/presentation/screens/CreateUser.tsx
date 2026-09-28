import { CustomFilledButton, PageHeader, useNotification } from "@/features/shared/shared";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { usersProvider } from "@/features/users/users";
import { type CreateOrUpdateUserPayload, Form } from "@/features/users/users";

export function CreateUser() {
  const notification = useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors },
    control
  } = useForm<CreateOrUpdateUserPayload>();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateOrUpdateUserPayload) => usersProvider.createUser(payload),
    onError: (err) => {
      notification.error(err.message);
    },
    onSuccess: (message) => {
      notification.success(message);
      navigate('/users');
      queryClient.invalidateQueries({ queryKey: ['getUsers'] });
      queryClient.invalidateQueries({ queryKey: ['getPaginatedUsers'] });
    }
  });

  const onSubmit = (data: CreateOrUpdateUserPayload) => mutate(data);
  return (
    <div>
      <PageHeader title="New user" description="Give someone access to the platform." backTo="/users" />

      <form className="form max-w-3xl" onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} control={control} />

        <CustomFilledButton
          label="Create"
          type="submit"
          disabled={isPending}
        />
      </form>
    </div>
  )
}
