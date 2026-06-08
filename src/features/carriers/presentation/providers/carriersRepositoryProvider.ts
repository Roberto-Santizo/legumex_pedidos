// Created by Luis

import api from '@/config/http/axios';
import { CarriersAPI } from '../../infrastructure/datasources/CarriersAPI';
import { CarriersRepositoryImpl } from '../../infrastructure/repositories/CarriersRepositoryImpl';
import { CarriersProvider } from './CarriersProvider';

const datasource = new CarriersAPI(api);
const repository = new CarriersRepositoryImpl(datasource);
export const carriersProvider = new CarriersProvider(repository);
