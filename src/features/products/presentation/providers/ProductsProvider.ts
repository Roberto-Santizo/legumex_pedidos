import type { CreateOrUpdateProductPayload, Product, ProductsRepository } from "../../products";

export class ProductsProvider {
    constructor(private repository: ProductsRepository) { }

    async createProduct(payload: CreateOrUpdateProductPayload): Promise<string> {
        const message = await this.repository.createProduct(payload);
        return message;
    }

    async getProducts() {
        const products = await this.repository.getProducts();
        return products;
    }

    async getProductById(id: string): Promise<Product> {
        const product = await this.repository.getProductById(id);
        return product;
    }

    async updateProductById({id, payload } : {id: string, payload: CreateOrUpdateProductPayload}): Promise<string> {
        const message = await this.repository.updateProductById(id, payload);
        return message;
    }
}