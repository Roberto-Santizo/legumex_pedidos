
import api from '@/config/http/axios';
import { ContainersDatasourceAPI } from '../../infrastructure/datasources/ContainersDatasourceAPI';
import { ContainersRepositoryImpl } from '../../infrastructure/repositories/ContainersRepositoryImpl';
import { ContainersProvider } from './ContainersProvider';

const datasource = new ContainersDatasourceAPI(api);
const repository = new ContainersRepositoryImpl(datasource);
export const containersProvider = new ContainersProvider(repository);
