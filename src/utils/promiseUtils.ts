/* eslint-disable @typescript-eslint/no-unused-vars */
export class Deferred<T> {
  promise: Promise<T>;
  resolve: { (response: T): void };
  reject: { (error: any): void };

  constructor() {
    this.resolve = (response: T) => {
      return;
    };
    this.reject = (error: any) => {
      return;
    };

    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
