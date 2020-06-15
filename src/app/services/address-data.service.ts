import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Address } from '../models/';

@Injectable({providedIn: 'root'})
export class AddressDataService {

    constructor(private http: HttpClient) {}

    getAddressList(column: string, pageIndex: number): Observable<Address[]> {
        return this.http.get<Address[]>(`/api/v1/address?column=${column}&page=${pageIndex}`);
    }

    uploadAddressList(files: Address[]):
    { [key: string]: { progress: Observable<number> } } {

    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number> } } = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('streetNumber', file.streetNumber);
      formData.append('street', file.street);
      formData.append('city', file.city);
      formData.append('state', file.state);
      formData.append('zipCode', file.zipCode);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', '/api/v1/upload', formData, {
        reportProgress: true
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {

          // calculate the progress percentage
          const percentDone = Math.round(100 * event.loaded / event.total);

          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer from the API
          // The upload is complete
          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status.file = {
        progress: progress.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }
}
