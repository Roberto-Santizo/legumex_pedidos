import { ClientDatasourceImpl, ClientRepositoryImpl } from "../../infrastructure/infrastructure";
import { ClientsProvider } from "./ClientsProvider";
import api from "@/config/http/axios";

const datasource = new ClientDatasourceImpl(api);
const repository = new ClientRepositoryImpl(datasource);
export const clientsProvider = new ClientsProvider(repository);