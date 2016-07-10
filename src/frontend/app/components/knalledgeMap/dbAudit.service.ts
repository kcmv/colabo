import { Injectable } from '@angular/core';
// import {Http, HTTP_PROVIDERS} from '@angular/http';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import {Change} from '../change/change';
import { Headers, RequestOptions } from '@angular/http';

// operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// statics
import 'rxjs/add/observable/throw';

/*
* HTTP
* https://angular.io/docs/ts/latest/guide/server-communication.html
* https://angular.io/docs/ts/latest/api/http/index/Http-class.html
*
* Services
* https://angular.io/docs/ts/latest/tutorial/toh-pt4.html
*/

@Injectable()
export class DbAuditService {
    apiUrl: string = "http://127.0.0.1:8888/dbAudits/";
    constructor(private http: Http) {
      console.log("DbAuditService constructed");
    }

    // http://127.0.0.1:8888/dbAudits/one/577d5cb55be86321489aacaa
    // hello() {
    //     alert("Hello!");
    // }

    getOne(id: string): Observable<any> {
        return this.http.get(this.apiUrl + "one/" + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    createPlain(change: Change): Observable<any> {
        // /return this.http.get(this.apiUrl + id)
        //     .map(this.extractData)
        //     .catch(this.handleError);
        return null;
    }

    create(change: Change): Observable<Change> {
      let body = JSON.stringify(change);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      return this.http.post(this.apiUrl, body, options)
        .map(this.extractData)
        .catch(this.handleError);
    }

    getChangesInMap(mapId: string): Observable<any> {
      return this.http.get(this.apiUrl + "in_map/" + mapId)
          .map(this.extractData)
          .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
    }

    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
