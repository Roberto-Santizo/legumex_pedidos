import { ProductsDatasource, ProductsRepository, type CreateOrUpdateProductPayload, type FiltersProducts, type PaginatedProducts, type Product } from '@/features/products/domain/domain';

export class ProductsRepositoryImpl implements ProductsRepository {
    constructor(private datasource: ProductsDatasource) { }

    uploadProducts(file: File): Promise<string> {
        return this.datasource.uploadProducts(file);
    }

    getPaginatedProducts({ limit, offset, filters }: { limit: number, offset: number, filters: FiltersProducts }): Promise<PaginatedProducts> {
        return this.datasource.getPaginatedProducts({ limit, offset, filters });
    }

    updateProductById(id: string, payload: CreateOrUpdateProductPayload): Promise<string> {
        return this.datasource.updateProductById(id, payload);
    }

    getProductById(id: string): Promise<Product> {
        return this.datasource.getProductById(id);
    }

    getProducts(client?: number, transportType?: string, dc?: string): Promise<Product[]> {
        return this.datasource.getProducts(client, transportType, dc);
    }

    createProduct(payload: CreateOrUpdateProductPayload): Promise<string> {
        return this.datasource.createProduct(payload);
    }

}