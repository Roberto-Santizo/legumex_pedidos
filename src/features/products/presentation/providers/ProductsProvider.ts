import type { CreateOrUpdateProductPayload, ProductsRepository } from "../../products";

export class ProductsProvider {
    constructor(private repository: ProductsRepository) { }

    async createProduct(payload: CreateOrUpdateProductPayload): Promise<string> {
        const message = await this.repository.createProduct(payload);
        return message;
    }
}