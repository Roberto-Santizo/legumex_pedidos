import type { CreateOrUpdateProductPayload } from "../domain";
import type { PaginatedProducts, Product } from "../types/types";

export abstract class ProductsRepository {
    abstract createProduct(payload: CreateOrUpdateProductPayload): Promise<string>;
    abstract getProducts(client?: number): Promise<Product[]>;
    abstract getPaginatedProducts({ limit, offset }: { limit: number, offset: number }): Promise<PaginatedProducts>;
    abstract getProductById(id: string): Promise<Product>;
    abstract updateProductById(id: string, payload: CreateOrUpdateProductPayload): Promise<string>;
}