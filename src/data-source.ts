import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  // Important: I'm using it for development
  // otherwise syncronize schema with cli
  synchronize: true,
  logging: false,
  entities: [],
});
