import type { CreateOrUpdateProductPayload } from "../domain";

export abstract class ProductsRepository {
    abstract createProduct(payload: CreateOrUpdateProductPayload): Promise<string>;
}