import api from "@/config/http/axios";
import { ProductsDatasourceImpl, ProductsRepositoryImpl } from "@/features/products/infrastructure/infrastructure";
import { ProductsProvider } from "./ProductsProvider";

const datasource = new ProductsDatasourceImpl(api);
const repository = new ProductsRepositoryImpl(datasource);
export const productsProvider = new ProductsProvider(repository); 