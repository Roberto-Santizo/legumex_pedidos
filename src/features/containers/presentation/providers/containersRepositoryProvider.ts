
import api from '@/config/http/axios';
import { ContainersDatasourceImpl } from '../../infrastructure/datasources/ContainersDatasourceImpl';
import { ContainersRepositoryImpl } from '../../infrastructure/repositories/ContainersRepositoryImpl';
import { ContainersProvider } from './ContainersProvider';

const datasource = new ContainersDatasourceImpl(api);
const repository = new ContainersRepositoryImpl(datasource);
export const containersProvider = new ContainersProvider(repository);
