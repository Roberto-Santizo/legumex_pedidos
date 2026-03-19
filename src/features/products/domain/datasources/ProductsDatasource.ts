import type { CreateOrUpdateProductPayload } from "../domain";
import type { Product } from "../types/types";

export abstract class ProductsDatasource {
    abstract createProduct(payload: CreateOrUpdateProductPayload): Promise<string>;
    abstract getProducts(): Promise<Product[]>;
    abstract getProductById(id: string): Promise<Product>;
    abstract updateProductById(id: string, payload: CreateOrUpdateProductPayload): Promise<string>;
}