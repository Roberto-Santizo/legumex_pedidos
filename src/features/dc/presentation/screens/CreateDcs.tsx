import { type CreateOrUpdateDc, dcsProvider, Form } from "@/features/dc/dc";
import { CustomFilledButton, useNotification } from "@/features/shared/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function CreateDcs() {
  const notification = useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    formState: { errors },
    register,
    control
  } = useForm<CreateOrUpdateDc>();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateOrUpdateDc) => dcsProvider.createDc(data),
    onError: (err) => {
      notification.error(err.message);
    },

    onSuccess: (message) => {
      notification.success(message);
      queryClient.invalidateQueries({ queryKey: ['getDcs'] });
      navigate('/dcs');
    }
  });

  const onSubmit = (data: CreateOrUpdateDc) => mutate(data);
  return (
    <div>
      <h1 className="main_title">Create Dc</h1>

      <form className="form mx-auto w-3/4" onSubmit={handleSubmit(onSubmit)}>
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
