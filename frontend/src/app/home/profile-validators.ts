import { ValidatorFn, AbstractControl } from '@angular/forms';

export function nameValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = /[^A-Za-z]/i.test(control.value);
      return forbidden ? {'nameValidator': control.value}: null;
    };
  }
export function phoneValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = /[0-9]{10}/i.test(control.value) && control.value.length === 10;
      return forbidden ? null: {'phoneValidator': control.value};
    };
  }