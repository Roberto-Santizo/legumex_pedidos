import type { CreateOrUpdateProductPayload, FiltersProducts, Product, ProductsRepository } from "../../products";

export class ProductsProvider {
    constructor(private repository: ProductsRepository) { }

    async createProduct(payload: CreateOrUpdateProductPayload): Promise<string> {
        const message = await this.repository.createProduct(payload);
        return message;
    }

    async getProducts(client?: number, transportType?: string) {
        const products = await this.repository.getProducts(client, transportType);
        return products;
    }

    async getPaginatedProducts({ limit, offset, filters }: { limit: number, offset: number, filters: FiltersProducts }) {
        const products = await this.repository.getPaginatedProducts({ limit, offset, filters });
        return products;
    }

    async getProductById(id: string): Promise<Product> {
        const product = await this.repository.getProductById(id);
        return product;
    }

    async updateProductById({ id, payload }: { id: string, payload: CreateOrUpdateProductPayload }): Promise<string> {
        const message = await this.repository.updateProductById(id, payload);
        return message;
    }
}