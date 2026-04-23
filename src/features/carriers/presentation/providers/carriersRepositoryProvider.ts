// Created by Luis

import api from '@/config/http/axios';
import { CarriersDatasourceImpl } from '../../infrastructure/datasources/CarriersDatasourceImpl';
import { CarriersRepositoryImpl } from '../../infrastructure/repositories/CarriersRepositoryImpl';
import { CarriersProvider } from './CarriersProvider';

const datasource = new CarriersDatasourceImpl(api);
const repository = new CarriersRepositoryImpl(datasource);
export const carriersProvider = new CarriersProvider(repository);
