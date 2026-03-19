import { productsProvider, type CreateOrUpdateProductPayload } from "@/features/products/products";
import { TextFormField, CustomFilledButton, useNotification } from '@/features/shared/shared';
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
    register
  } = useForm<CreateOrUpdateProductPayload>();

  const onSubmit = (data: CreateOrUpdateProductPayload) => mutate(data);
  return (
    <div className="space-y-5">
      <h1 className="main_title">Create Product</h1>

      <form className="form mx-auto w-3/4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextFormField<CreateOrUpdateProductPayload>
          label="Name"
          name="name"
          placeholder="Product name"
          register={register}
          type="text"
          validation={{ required: 'Product name is Required' }}
          errorMessage={errors.name?.message}
        />

        <TextFormField<CreateOrUpdateProductPayload>
          label="Local Code"
          name="localCode"
          placeholder="Product Local Code"
          register={register}
          type="text"
          validation={{ required: 'Product Local Code is Required' }}
          errorMessage={errors.localCode?.message}
        />

        <TextFormField<CreateOrUpdateProductPayload>
          label="International Code"
          name="internationalCode"
          placeholder="Product International Code"
          register={register}
          type="text"
          validation={{ required: 'Product International Code is Required' }}
          errorMessage={errors.internationalCode?.message}
        />

        <TextFormField<CreateOrUpdateProductPayload>
          label="Price"
          name="price"
          placeholder="Product Price"
          register={register}
          type="number"
          validation={{ required: 'Product Price is Required' }}
          errorMessage={errors.price?.message}
        />

        <TextFormField<CreateOrUpdateProductPayload>
          label="Presentation"
          name="presentation"
          placeholder="Product Presentation"
          register={register}
          type="number"
          validation={{ required: 'Product Presentation is Required' }}
          errorMessage={errors.presentation?.message}
        />

        <CustomFilledButton
          label="Create"
          type="submit"
          disabled={isPending}
        />
      </form>
    </div>
  )
}
