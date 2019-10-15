export class ServerError {
  public message: string;
  public code: string;

  constructor(code: string, message: string = undefined) {
    this.message = message;
    this.code = code;
  }
}

export enum KMapErrors {
  TEMPLATE_LOADING = "TEMPLATE_LOADING",
  MAP_SAVING = "MAP_SAVING",
  MAP_CREATE = "MAP_CREATE"
}
