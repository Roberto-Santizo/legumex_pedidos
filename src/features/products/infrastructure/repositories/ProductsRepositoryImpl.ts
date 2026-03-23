import { ProductsDatasource, ProductsRepository, type CreateOrUpdateProductPayload, type PaginatedProducts, type Product } from '@/features/products/domain/domain';

export class ProductsRepositoryImpl implements ProductsRepository {
    constructor(private datasource: ProductsDatasource) { }

    getPaginatedProducts({ limit, offset }: { limit: number; offset: number; }): Promise<PaginatedProducts> {
        return this.datasource.getPaginatedProducts({ limit, offset });
    }

    updateProductById(id: string, payload: CreateOrUpdateProductPayload): Promise<string> {
        return this.datasource.updateProductById(id, payload);
    }

    getProductById(id: string): Promise<Product> {
        return this.datasource.getProductById(id);
    }

    getProducts(): Promise<Product[]> {
        return this.datasource.getProducts();
    }

    createProduct(payload: CreateOrUpdateProductPayload): Promise<string> {
        return this.datasource.createProduct(payload);
    }

}