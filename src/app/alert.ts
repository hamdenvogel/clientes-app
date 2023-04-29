export class IAlert {
  type?: string;
  msg?: string;
  timeout?: number;
}

export class Alert implements IAlert {
  constructor (
    public type: string,
    public msg: string,
    public timeout: number
  ) {
      this.type = type ? type : "";
      this.msg = msg ? msg : "";
      this.timeout = timeout ? timeout : 0;
  }
}
