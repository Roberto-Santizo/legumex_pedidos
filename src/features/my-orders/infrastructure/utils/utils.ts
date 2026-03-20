import type { Product } from "@/features/products/products";
import type { Option } from "@/features/shared/shared";

export const productsToOptions = (products: Product[]): Option[] => {
    const options: Option[] = products.map((product) => {
        return {
            value: product.id,
            label: product.name
        }
    })

    return options;
}