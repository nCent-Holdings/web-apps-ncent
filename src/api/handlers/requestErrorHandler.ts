import { unflatten } from 'flat';
import { ValidationException } from '../../lib/X';

const requestErrorHandler = (error: any) => {
  if (error.code === 'FORMAT_ERROR') {
    throw new ValidationException(unflatten(error.fields, { delimiter: '/' }).data);
  }

  throw error;
};

export default requestErrorHandler;
