import LIVR from 'livr';
import { ValidationException } from './X';

export default class Validator<T extends object> extends LIVR.Validator<T> {
  validate(data: T): T {
    const validData = super.validate(data);

    if (!validData) {
      throw new ValidationException(this.getErrors());
    }

    return validData;
  }
}
