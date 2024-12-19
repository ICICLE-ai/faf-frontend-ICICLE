import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // private apiUrl = 'http://localhost:8080/domestic_imports/';

  // constructor(private http: HttpClient) {}

  // postDomesticImports(data: { origin: string; timeframe: number[] }): Observable<any> {
  //   return this.http.post(this.apiUrl, data);
  // }

  // private baseURL = 'http://127.0.0.1:8080'; //for local
  private baseURL = 'http://backend:8000'; //for docker

  constructor(private http: HttpClient) {}

  postDomesticFlow(data: { origin: string; timeframe: number[] }): Observable<Blob> {
    // Set the response type to Blob for file downloads
    const apiUrl = this.baseURL + '/exports/';
    return this.http.post(apiUrl, data, { responseType: 'blob' });
  }

  postForeignImport(data: { origin: string; timeframe: number[] }): Observable<Blob> {
    // Set the response type to Blob for file downloads
    const apiUrl = this.baseURL + '/imports/';
    return this.http.post(apiUrl, data, { responseType: 'blob' });
  }

  postForeignExport(data: { origin: string; timeframe: number[] }): Observable<Blob> {
    // Set the response type to Blob for file downloads
    const apiUrl = this.baseURL + '/exports/';
    return this.http.post(apiUrl, data, { responseType: 'blob' });
  }

  // postForeignFlow(payload: any, tabName: string): Observable<Blob> {
  //   // Set the response type to Blob for file downloads
  //   const apiUrl = this.baseURL + '/domestic_exports/';
  //   return this.http.post(apiUrl, payload, { responseType: 'blob' });
  // }

  loadCommodityDetails(): Observable<any> {
    const apiUrl = this.baseURL + '/get_commodity/';
    return this.http.get<any>(apiUrl);  // Adjust the return type if known
  }

  loadTranspotationDetails(): Observable<any> {
    const apiUrl = this.baseURL + '/get_transpotation/';
    return this.http.get<any>(apiUrl);  // Adjust the return type if known
  }

  loadDomesticOriginDetails(): Observable<any> {
    const apiUrl = this.baseURL + '/get_domestic_origin/';
    return this.http.get<any>(apiUrl);  // Adjust the return type if known
  }

  loadDomesticDestinationDetails(): Observable<any> {
    const apiUrl = this.baseURL + '/get_domestic_destination/';
    return this.http.get<any>(apiUrl);  // Adjust the return type if known
  }

  loadDomesticFlowTabDetails(): Observable<any> {
    const apiUrl = this.baseURL + '/get_domestic_flow_details/';
    return this.http.get<any>(apiUrl);  // Adjust the return type if known
  }
  loadForeignImportTabDetails(): Observable<any> {
    const apiUrl = this.baseURL + '/get_foreign_import_details/';
    return this.http.get<any>(apiUrl);  // Adjust the return type if known
  }
  loadForeignExportTabDetails(): Observable<any> {
    const apiUrl = this.baseURL + '/get_foreign_export_details/';
    return this.http.get<any>(apiUrl);  // Adjust the return type if known
  }

  // loadTranspotationModeDetails(): Observable<any> {
  //   const apiUrl = this.baseURL + '/get_export_mode_Details/';
  //   return this.http.get<any>(apiUrl);  // Adjust the return type if known
  // }

  // loadBarChartDetails(): Observable<any> {
  //   const apiUrl = this.baseURL + '/get_bar_chart_Details/';
  //   return this.http.get<any>(apiUrl);  // Adjust the return type if known
  // }

  loadBarChartDetails(payload: any): Observable<any> {
    const apiUrl = this.baseURL + '/get_bar_chart_details/';
    return this.http.post<any>(apiUrl, payload); // Send the payload in the POST request
}

loadTranspotationModeDetails(payload: any): Observable<any> {
  const apiUrl = this.baseURL + '/get_mode_details/';
  return this.http.post<any>(apiUrl, payload); // Send the payload in the POST request
}

loadImportExportStateDetails(payload: any): Observable<any> {
  const apiUrl = this.baseURL + '/import_export_sum/';
  return this.http.post<any>(apiUrl, payload); // Send the payload in the POST request
}

  
}
