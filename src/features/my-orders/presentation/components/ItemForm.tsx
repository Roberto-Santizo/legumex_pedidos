import { productsToOptions, type AddItemForm } from "@/features/my-orders/my-orders";
import { SelectFormField, TextFormField } from "@/features/shared/shared";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { productsProvider } from "@/features/products/products";
import { useQuery } from "@tanstack/react-query";

type Props = {
    register: UseFormRegister<AddItemForm>;
    errors: FieldErrors<AddItemForm>;
    control: Control<AddItemForm, any, AddItemForm>;
    client: number;
    transportType: string;
}

export function ItemForm({ register, errors, control, client, transportType }: Props) {

    const { data: products } = useQuery({
        queryKey: ['getProducts', client, transportType],
        queryFn: () => productsProvider.getProducts(client, transportType),
    });


    if (products) return (
        <>
            <SelectFormField<AddItemForm>
                label="Product"
                name="product_id"
                options={productsToOptions(products)}
                control={control}
                errorMessage={errors.product_id?.message}
                validation={{ required: 'Product is requierd' }}
            />
            <TextFormField<AddItemForm>
                label="Boxes"
                name="total_boxes"
                placeholder="Total boxes"
                register={register}
                type="number"
                validation={{ required: 'Total Boxes are required' }}
                errorMessage={errors.total_boxes?.message}
            />

            <TextFormField<AddItemForm>
                label="PO"
                name="po"
                placeholder="PO information"
                register={register}
                type="text"
                validation={{ required: 'PO is required' }}
                errorMessage={errors.po?.message}
            />
        </>
    )
}
