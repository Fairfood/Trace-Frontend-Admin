import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * The function `notOnlyWhitespace` is a custom validator in TypeScript that checks if a form control
 * value contains only whitespace characters.
 **/
export function notOnlyWhitespace(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { notOnlyWhitespace: true } : null;
  };
}
