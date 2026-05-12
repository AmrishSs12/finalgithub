import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function CustomValidators() {
    let allowedValuesValidator = function (values: string[], isAllowed = true) {
        return (control: AbstractControl): ValidationErrors | null => {
            const valuePresent = values.includes(control.value);
            const invalid = isAllowed ? !valuePresent : valuePresent;
            const errorKey = isAllowed ? 'allowedValues' : 'notAllowedValues';
            return invalid ? { [errorKey]: { value: control.value } } : null;
        };
    }
}



CustomValidators.prototype.allowedValuesValidator = function (values: string[], isAllowed = true) {
    return (control: AbstractControl): ValidationErrors | null => {
        const valuePresent = values.includes(control.value);
        const invalid = isAllowed ? !valuePresent : valuePresent;
        const errorKey = isAllowed ? 'allowedValues' : 'notAllowedValues';
        return invalid ? { [errorKey]: { value: control.value } } : null;
    };
}


export function validateNumber(control: any): ValidatorFn {
    const numberRegex = /^\d+$/;
    if (control.value && !numberRegex.test(control.value)) {
        control.setValue(control.value.replace(/[^0-9]+/g, ""));
    }
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        return null;
    }
}

export function ValidateDouble(control: any): ValidatorFn {
    const doubleRegex = /^\d*\.?\d*$/;
    if (control.value && !doubleRegex.test(control.value)) {
        control.setValue(control.value.replace(/[^0-9.]/g, ""));
    }
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        return null;
    }
}


export function validatePattern(config: any): ValidatorFn {
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


export function minLengthValidator(config: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value && config.minLength) {
            if (control.value.length < config.minLength) {
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



export function maxLengthValidator(config: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value && config.maxLength && (control.value.length > config.maxLength)) {
            control.setValue(control.value.slice(0, config.maxLength));
        }
        return null;
    }
}


export function minValueValidator(config: any): ValidatorFn {
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


export function maxValueValidator(config: any): ValidatorFn {
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


export function minFractionValidator(config: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const dec = control.value.split('.')[1];
        if (Number(control.value) > 0) {
            setTimeout(() => {
                control.setValue(addZeroes(control.value, config.minFractionDigits));
            }, 1000);
        }
        return null;
    }
}

export function maxFractionValidator(config: any): ValidatorFn {

    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const dec = control.value.split('.')[1];
        if (Number(control.value) > 0) {
            setTimeout(() => {
                control.setValue(removeZeroes(control.value, config.maxFractionDigits));
            }, 1000);
        }
        return null;
    }
}



function addZeroes(num: any, fractionDigit: number) {
    const dec = num.split('.')[1]
    const len = dec && dec.length > fractionDigit ? dec.length : fractionDigit;
    let value = Number(num).toFixed(len);
    return String(value);
}


function removeZeroes(num: any, fractionDigit: number) {
    const dec = num.split('.')[1]
    const len = dec && dec.length < fractionDigit ? dec.length : fractionDigit;
    let value = Number(num).toFixed(len);
    return String(value);
}







