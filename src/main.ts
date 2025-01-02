import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideRouter, Routes } from '@angular/router';
// import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import * as process from 'process';



// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),provideHttpClient()],
}).catch((err) => console.error(err));

