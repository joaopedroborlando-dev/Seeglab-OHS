import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Stricter than Validators.email: requires a dot-separated domain with a TLD (rejects "a@b")
const EMAIL_REGEX = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-zA-Z]{2,}$/;

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function isValidCpf(cpf: string): boolean {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  const checkDigit = (length: number): number => {
    let sum = 0;
    for (let i = 0; i < length; i++) sum += Number(cpf[i]) * (length + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return checkDigit(9) === Number(cpf[9]) && checkDigit(10) === Number(cpf[10]);
}

// Supports the alphanumeric CNPJ (Receita Federal, 2026): first 12 chars may be A-Z, check digits stay numeric
function isValidCnpj(cnpj: string): boolean {
  if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj) || /^(\d)\1{13}$/.test(cnpj)) return false;
  const checkDigit = (length: number): number => {
    let sum = 0;
    let weight = length - 7;
    for (let i = 0; i < length; i++) {
      sum += (cnpj.charCodeAt(i) - 48) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  return checkDigit(12) === Number(cnpj[12]) && checkDigit(13) === Number(cnpj[13]);
}

function isValidCpfOrCnpj(value: string): boolean {
  const normalized = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return normalized.length === 11 ? isValidCpf(normalized) : isValidCnpj(normalized);
}

// Brazilian phone: valid DDD (11-99) + 8 digits (landline) or 9 digits starting with 9 (mobile)
function isValidPhone(value: string): boolean {
  return /^[1-9][1-9](9\d{8}|[2-8]\d{7})$/.test(onlyDigits(value));
}

// Empty values are left to Validators.required
function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    !control.value || EMAIL_REGEX.test(String(control.value).trim()) ? null : { email: true };
}

function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    !control.value || isValidPhone(String(control.value)) ? null : { phone: true };
}

function documentValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    !control.value || isValidCpfOrCnpj(String(control.value)) ? null : { document: true };
}

export {
  isValidCpf,
  isValidCnpj,
  isValidCpfOrCnpj,
  isValidPhone,
  emailValidator,
  phoneValidator,
  documentValidator
}
