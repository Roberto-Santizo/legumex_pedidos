import { Form, productsProvider, type CreateOrUpdateProductPayload } from "@/features/products/products";
import { CustomFilledButton, useNotification } from '@/features/shared/shared';
import { useForm } from "react-hook-form"
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export function CreateProduct() {
  const { error, success } = useNotification();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateOrUpdateProductPayload) => productsProvider.createProduct(payload),
    onError: (err) => {
      error(err.message);
    },
    onSuccess: (message) => {
      success(message);
      navigate('/products', { replace: true });
    }
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
    control
  } = useForm<CreateOrUpdateProductPayload>();

  const onSubmit = (data: CreateOrUpdateProductPayload) => mutate(data);
  return (
    <div className="space-y-5">
      <h1 className="main_title">Create Product</h1>

      <form className="form mx-auto w-3/4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
