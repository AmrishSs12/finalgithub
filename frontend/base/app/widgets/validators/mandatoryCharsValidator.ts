import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function mandatoryCharsValidator(values: RegExp[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const isMatch = values.every(rx => rx.test(control.value));
    return isMatch ? { mandatoryCharacters: { value: control.value } } : null;
  };
}