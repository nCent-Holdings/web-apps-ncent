import LIVR from 'livr';

export const validateEmail = async (email: string): Promise<{ isValid: boolean; errorText?: string }> => {
  const validator = new LIVR.Validator({
    email: ['required', 'email'],
  });

  if (email === '') {
    return { isValid: false, errorText: 'Email address cannot be empty.' };
  } else if (!validator.validate({ email })) {
    return {
      isValid: false,
      errorText: 'Email address is invalid.',
    };
  }

  return { isValid: true };
};
