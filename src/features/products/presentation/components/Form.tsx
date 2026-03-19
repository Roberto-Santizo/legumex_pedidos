import { TextFormField } from "@/features/shared/shared";
import type { CreateOrUpdateProductPayload } from "../../products";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
    register: UseFormRegister<CreateOrUpdateProductPayload>;
    errors: FieldErrors<CreateOrUpdateProductPayload>;
}

export function Form({ register, errors }: Props) {
    return (
        <>
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
        </>
    )
}
