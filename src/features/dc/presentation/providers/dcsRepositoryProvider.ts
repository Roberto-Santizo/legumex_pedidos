import api from "@/config/http/axios";
import { DcDatasourceImpl, DcRepositoryImpl } from "@/features/dc/infrastructure/infrastructure";
import { DcsProvider } from "./DcsProvider";

const datasource = new DcDatasourceImpl(api);
const repository = new DcRepositoryImpl(datasource);
export const dcsProvider = new DcsProvider(repository);