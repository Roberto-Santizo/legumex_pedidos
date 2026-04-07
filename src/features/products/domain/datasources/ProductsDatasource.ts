import type { CreateOrUpdateProductPayload, FiltersProducts } from "../domain";
import type { PaginatedProducts, Product } from "../types/types";

export abstract class ProductsDatasource {
    abstract createProduct(payload: CreateOrUpdateProductPayload): Promise<string>;
    abstract getProducts(client?: number, transportType?: string, dc?: string): Promise<Product[]>;
    abstract getPaginatedProducts({ limit, offset, filters }: { limit: number, offset: number, filters: FiltersProducts }): Promise<PaginatedProducts>;
    abstract getProductById(id: string): Promise<Product>;
    abstract updateProductById(id: string, payload: CreateOrUpdateProductPayload): Promise<string>;
}