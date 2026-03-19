import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom"
import { Form, productsProvider, type CreateOrUpdateProductPayload } from "@/features/products/products";
import { CustomFilledButton, useNotification } from "@/features/shared/shared";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function UpdateProduct() {
    const { error, success } = useNotification();
    const navigate = useNavigate();

    const params = useParams();
    const id = params.id!;

    const { data: product, isLoading } = useQuery({
        queryKey: ['getProductById', id],
        queryFn: () => productsProvider.getProductById(id),
        enabled: !!id
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (variables: { id: string; payload: CreateOrUpdateProductPayload }) => productsProvider.updateProductById(variables),
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
        setValue
    } = useForm<CreateOrUpdateProductPayload>();

    useEffect(() => {
        if (product) {
            setValue('name', product.name)
            setValue('localCode', product.localCode)
            setValue('internationalCode', product.internationalCode)
            setValue('price', product.price)
            setValue('presentation', product.presentation)
        }
    }, [product]);

    const onSubmit = (payload: CreateOrUpdateProductPayload) => mutate({ id, payload });

    if (isLoading) return <p>Loading...</p>

    if (product) return (
        <div className="space-y-5">
            <h1 className="main_title">Update Product</h1>
            <form className="form mx-auto w-3/4" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Form register={register} errors={errors} />

                <CustomFilledButton
                    label="Update"
                    type="submit"
                    disabled={isPending}
                />
            </form>
        </div>
    )
}
