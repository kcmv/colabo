# KnalledgeStoreCore Demo

## Building. CLI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0.

- **Development server**
  Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
- **Code scaffolding**
- Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.
- **Build**
  Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.
- **Further help**
  To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Testing

- **Running unit tests**
  Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
- **Running end-to-end tests**
  Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Knalledge Coding

### HTTP Client. Observable

1. you might need to lear more about **piping**
2. **map** is something you should be familiar with
   http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-map
   **map** applies a given project function to each value emitted by the source Observable, and emits the resulting values as an Observable.
3. to learn basics of working with the server by using HttpClient read:
   1. https://angular.io/tutorial/toh-pt6
   2. https://angular.io/api/common/http/HttpClient

### Using Knalledge Services

#### Calling methods

methods return **Observables**. We should subsrcibe our methods on their result.

**IMPORTANT**: Even if we don't want to treat the result in any manner, we still have to subsrcribe, because until subscribed, the HttpClient call would not be executed at all

```typescript
   this.knalledgeMapService.getById(this.map_id)
   	.subscribe(map => this.mapReceived(map));
```
Other (**depricated**) approach is to pass a callback function:

```typescript
this.knalledgeMapService.getById(this.map_id, this.mapReceived.bind(this));
```

because (so far) Knalledge Service methods have this kind of singature

```typescript
getById(id:string, callback?:Function): Observable<KMap>
```

This approach, often requires binding the callback method, as you can see in the upper example, in order to have access to the callback's context (*this*)

