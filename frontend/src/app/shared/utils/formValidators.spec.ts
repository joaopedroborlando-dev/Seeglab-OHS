import { FormControl } from '@angular/forms';
import {
  documentValidator,
  emailValidator,
  isValidCnpj,
  isValidCpf,
  isValidCpfOrCnpj,
  isValidPhone,
  phoneValidator
} from './formValidators';

describe('formValidators', () => {
  describe('isValidCpf', () => {
    it('should accept a CPF with valid check digits', () => {
      expect(isValidCpf('52998224725')).toBeTrue();
    });

    it('should reject wrong check digits, repeated digits and wrong length', () => {
      expect(isValidCpf('52998224726')).toBeFalse();
      expect(isValidCpf('11111111111')).toBeFalse();
      expect(isValidCpf('5299822472')).toBeFalse();
    });
  });

  describe('isValidCnpj', () => {
    it('should accept numeric and alphanumeric CNPJs with valid check digits', () => {
      expect(isValidCnpj('11222333000181')).toBeTrue();
      expect(isValidCnpj('12ABC34501DE35')).toBeTrue();
    });

    it('should reject wrong check digits and repeated digits', () => {
      expect(isValidCnpj('11222333000182')).toBeFalse();
      expect(isValidCnpj('00000000000000')).toBeFalse();
    });
  });

  describe('isValidCpfOrCnpj', () => {
    it('should accept masked values', () => {
      expect(isValidCpfOrCnpj('529.982.247-25')).toBeTrue();
      expect(isValidCpfOrCnpj('11.222.333/0001-81')).toBeTrue();
    });

    it('should reject lengths that are neither CPF nor CNPJ', () => {
      expect(isValidCpfOrCnpj('529982247251')).toBeFalse();
      expect(isValidCpfOrCnpj('1122233300018')).toBeFalse();
    });
  });

  describe('isValidPhone', () => {
    it('should accept mobile and landline numbers', () => {
      expect(isValidPhone('(11) 98765-4321')).toBeTrue();
      expect(isValidPhone('(11) 3456-7890')).toBeTrue();
    });

    it('should reject invalid DDD, 11 digits not starting with 9 and short numbers', () => {
      expect(isValidPhone('(01) 98765-4321')).toBeFalse();
      expect(isValidPhone('(11) 88765-4321')).toBeFalse();
      expect(isValidPhone('(11) 9876-543')).toBeFalse();
    });
  });

  describe('ValidatorFns', () => {
    it('should leave empty values to Validators.required', () => {
      expect(emailValidator()(new FormControl(''))).toBeNull();
      expect(phoneValidator()(new FormControl(''))).toBeNull();
      expect(documentValidator()(new FormControl(''))).toBeNull();
    });

    it('should flag an email without a TLD', () => {
      expect(emailValidator()(new FormControl('user@domain'))).toEqual({ email: true });
      expect(emailValidator()(new FormControl('user@domain.com'))).toBeNull();
    });

    it('should flag invalid phone and document', () => {
      expect(phoneValidator()(new FormControl('(11) 1234'))).toEqual({ phone: true });
      expect(documentValidator()(new FormControl('12345678900'))).toEqual({ document: true });
    });
  });
});
