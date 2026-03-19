import api from "@/config/http/axios";
import { OrdersDatasourceImpl, OrdersRepositoryImpl } from "../../infrastructure/infrastructure";
import { OrdersProvider } from "./OrdersProvider";

const datasource = new OrdersDatasourceImpl(api);
const repository = new OrdersRepositoryImpl(datasource);
export const ordersProvider = new OrdersProvider(repository);