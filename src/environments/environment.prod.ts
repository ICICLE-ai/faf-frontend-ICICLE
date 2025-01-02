// export const environment = {
//     production: true,
//     baseURL: process.env['BASE_URL'] || 'http://localhost:8000',  // Accessing using index signature
//   };


import { InjectionToken } from '@angular/core';

export const ENVIRONMENT = new InjectionToken<any>('environment');

export const environment = {
  production: true,
  baseURL: 'http://localhost:8080', // Default value for local development
  myVariable: 'default_value'
};
  