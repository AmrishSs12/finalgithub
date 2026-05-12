import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function allowedValuesValidator(values: string[], isAllowed: boolean): ValidatorFn {
  return (control: AbstractControl): any => {
    if (!control.value)
      return null;
    return commonAllowedValCheck(values, isAllowed, control);
  };
}

export function commonAllowedValCheck(values: string[], isAllowed: boolean, control: any) {
  let valuePresent = values.filter(val => control.value.includes(val)).length > 0;
  let filterlength = removeDuplicates(values.filter(val => control.value.includes(val))).length;
  let Unduplicated = [...control.value];
  let valuelength = removeDuplicates(Unduplicated).length;
  if (isAllowed) {
    if (valuelength > filterlength) {
      valuePresent = false;
    }
  }
  const invalid = isAllowed ? !valuePresent : valuePresent;
  const errorKey = isAllowed ? 'allowedValues' : 'notAllowedValues';
  return invalid ? { [errorKey]: { value: control.value } } : null;
}

function removeDuplicates(arr: any[]) {
  var unique: any[] = [];
  arr.forEach((element: any) => {
    if (!unique.includes(element)) {
      unique.push(element);
    }
  });
  return unique;
}
