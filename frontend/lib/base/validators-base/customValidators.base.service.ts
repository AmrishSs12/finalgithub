import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

@Injectable({
    providedIn: 'root',
})

export class CustomValidatorBaseService {

    allowedValuesValidator(values: string[], isAllowed: boolean): ValidatorFn {
        return (control: AbstractControl): any => {
            if (!control.value)
                return null;
            return this.commonAllowedValCheck(values, isAllowed, control);
        };
    }

    commonAllowedValCheck(values: string[], isAllowed: boolean, control: any) {
        let valuePresent = values.filter(val => control.value.includes(val)).length > 0;
        let filterlength = this.removeDuplicates(values.filter(val => control.value.includes(val))).length;
        let Unduplicated = [...control.value];
        let valuelength = this.removeDuplicates(Unduplicated).length;
        if (isAllowed) {
            if (valuelength > filterlength) {
                valuePresent = false;
            }
        }
        const invalid = isAllowed ? !valuePresent : valuePresent;
        const errorKey = isAllowed ? 'allowedValues' : 'notAllowedValues';
        return invalid ? { [errorKey]: { value: control.value } } : null;
    }

    removeDuplicates(arr: any[]) {
        var unique: any[] = [];
        arr.forEach((element: any) => {
            if (!unique.includes(element)) {
                unique.push(element);
            }
        });
        return unique;
    }

    dateValidator(type: string, config?: any): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            let invalid = true;
            let errorKey = 'invalidDate';
            if (!control.value) {
                invalid = false;
            } else {
                let day = control.value.getDay();
                switch (type) {
                    case 'WeekDaysOnly':
                        invalid = [0, 6].includes(day);
                        errorKey = 'weekDaysOnly';
                        break;

                    case 'WeekEndsOnly':
                        invalid = ![0, 6].includes(day);
                        errorKey = 'weekEndsOnly';
                        break;

                    case 'min':
                        invalid = (control.value < config?.calendarMinDate);
                        errorKey = 'min';
                        break;

                    case 'max':
                        invalid = (control.value > config?.calendarMaxDate);
                        errorKey = 'max';
                        break;

                    default:
                        break;
                }

            }


            return invalid ? { [errorKey]: { value: control.value } } : null;
        };
    }


    validateNumber(control: any): ValidatorFn {
        const numberRegex = /^\d+$/;
        if (control.value && !numberRegex.test(control.value)) {
            control.setValue(control.value.replace(/[^0-9]+/g, ""));
        }
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            return null;
        }
    }

    ValidateDouble(control: any): ValidatorFn {
        const doubleRegex = /^\d*\.?\d*$/;
        if (control.value && !doubleRegex.test(control.value)) {
            control.setValue(control.value.replace(/[^0-9.]/g, ""));
        }
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            return null;
        }
    }


    validatePattern(config: any): ValidatorFn {
        if (config.pattern) {
            return (control: AbstractControl): { [key: string]: boolean } | null => {
                const pattern = new RegExp(config.pattern);
                if (pattern.test(control.value)) {
                    return ({ 'pattern': false });
                }
                else {
                    return ({ 'pattern': true });
                }

            }
        }
        else {
            return (control: AbstractControl): { [key: string]: boolean } | null => {
                return null;
            }

        }

    }


    minLengthValidator(config?: any): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value && 10) {
                if (control.value.length < 10) {
                    return ({ 'minLength': true });
                }
                else {
                    return ({ 'minLength': false });
                }
            }
            else {
                return null;
            }

        }
    }



    maxLengthValidator(config: any): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value && config.maxLength && (control.value.length > config.maxLength)) {
                control.setValue(control.value.slice(0, config.maxLength));
            }
            return null;
        }
    }


    minValueValidator(config: any): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value && config.minValue) {
                if (Number(control.value) < config.minValue) {
                    return { 'minValue': true };
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        }
    }


    maxValueValidator(config: any): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value && config.maxValue) {
                if (Number(control.value) > config.maxValue) {
                    return { 'maxValue': true };
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        }
    }


    minFractionValidator(config: any): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            const dec = control.value.split('.')[1];
            if (Number(control.value) > 0) {
                setTimeout(() => {
                    control.setValue(this.addZeroes(control.value, config.minFractionDigits));
                }, 1000);
            }
            return null;
        }
    }

    maxFractionValidator(config: any): ValidatorFn {

        return (control: AbstractControl): { [key: string]: boolean } | null => {
            const dec = control.value.split('.')[1];
            if (Number(control.value) > 0) {
                setTimeout(() => {
                    control.setValue(this.removeZeroes(control.value, config.maxFractionDigits));
                }, 1000);
            }
            return null;
        }
    }



    addZeroes(num: any, fractionDigit: number) {
        const dec = num.split('.')[1]
        const len = dec && dec.length > fractionDigit ? dec.length : fractionDigit;
        let value = Number(num).toFixed(len);
        return String(value);
    }


    removeZeroes(num: any, fractionDigit: number) {
        const dec = num.split('.')[1]
        const len = dec && dec.length < fractionDigit ? dec.length : fractionDigit;
        let value = Number(num).toFixed(len);
        return String(value);
    }



}