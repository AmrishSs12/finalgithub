import { Injectable } from "@angular/core";
import { CustomValidatorBaseService } from "@libbase/validators-base/customValidators.base.service";

@Injectable({
    providedIn: 'root',
})

export class CustomValidatorService extends CustomValidatorBaseService {
    /* Example to override validators
    override allowedValuesValidator(values: string[], isAllowed: boolean): ValidatorFn {
        return (control: AbstractControl): any => {
            if (!control.value)
                return null;
            return this.commonAllowedValCheck(values, isAllowed, control);
        };
    }*/



}