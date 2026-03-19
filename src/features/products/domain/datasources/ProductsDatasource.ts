import type { CreateOrUpdateProductPayload } from "../domain";

export abstract class ProductsDatasource {
    abstract createProduct(payload: CreateOrUpdateProductPayload): Promise<string>;
}