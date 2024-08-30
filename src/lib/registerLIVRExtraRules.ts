import LIVR from 'livr';
import util from 'livr/lib/util.js';
import { PhoneNumberUtil } from 'google-libphonenumber';

function password() {
  return (value: any, params: any, outputArr: any[]) => {
    if (util.isNoValue(value)) return;
    if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

    const specialCharacters = '!@#$%^&*_+-=()<>{}';
    const hasSpecialChars = /[!@#$^&*_+\-=()<>{}]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);

    if (value.length < 8) {
      return `Password must be 8 or more characters.`;
    } else if (!hasSpecialChars) {
      return `Password must include a special character: ${specialCharacters}`;
    } else if (!hasUpperCase || !hasLowerCase) {
      return `Password must contain a mix of uppercase and lowercase characters`;
    } else if (!hasNumber) {
      return `Password must at least one number`;
    } else {
      outputArr.push(value);
    }
  };
}

function us_phone_number() {
  return (value: any, params: any, outputArr: any[]) => {
    if (util.isNoValue(value)) return;
    if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

    // eslint-disable-next-line no-useless-escape
    const usPhoneNumber = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(value);

    if (!usPhoneNumber) {
      return 'INVALID_PHONE_NUMBER';
    } else {
      outputArr.push(value);
    }
  };
}

function phone_number() {
  return (value: any, params: any, outputArr: any[]) => {
    const phoneUtil = PhoneNumberUtil.getInstance();

    const isPhoneValid = (phone: string) => {
      try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
      } catch (error) {
        return false;
      }
    };

    if (!isPhoneValid(value)) {
      return 'INVALID_PHONE_NUMBER';
    } else {
      outputArr.push(value);
    }
  };
}

function us_zip_code() {
  return (value: any, params: any, outputArr: any[]) => {
    if (util.isNoValue(value)) return;
    if (!util.isPrimitiveValue(value)) return 'FORMAT_ERROR';

    const usZipCode = /^[0-9]{5}(?:-[0-9]{4})?$/.test(value);

    if (!usZipCode) {
      return 'INVALID_ZIP_CODE';
    } else {
      outputArr.push(value);
    }
  };
}

const extraRules = {
  password,
  us_phone_number,
  us_zip_code,
  phone_number,
};

LIVR.Validator.registerDefaultRules(extraRules);
