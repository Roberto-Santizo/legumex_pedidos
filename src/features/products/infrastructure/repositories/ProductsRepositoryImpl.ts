import { ProductsDatasource, ProductsRepository, type CreateOrUpdateProductPayload } from '@/features/products/domain/domain';

export class ProductsRepositoryImpl implements ProductsRepository {
    constructor(private datasource: ProductsDatasource) { }

    createProduct(payload: CreateOrUpdateProductPayload): Promise<string> {
        return this.datasource.createProduct(payload);
    }

}