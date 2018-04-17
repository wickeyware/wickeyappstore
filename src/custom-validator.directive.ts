// This directive is for writing code level form validation in angular.
// https://angular.io/guide/form-validation#custom-validation
//
// You must use reactive forms
// import { ReactiveFormsModule } from '@angular/forms'; into app.module.ts]
//
// the following is within a componenent
//  public emailForm: FormGroup;
//   public tokenForm: FormGroup;

//   constructor(
//     private fb: FormBuilder
//   ) {
//   }

//   ngOnInit(): void {
//     this.buildEmailForm();
//   }

//   buildEmailForm(): void {
//     this.emailForm = this.fb.group({
//       'email': [this.user.email, [
//         Validators.required,
//         Validators.minLength(4),
//         customValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i)
//       ]
//       ]
//     });
//     this.emailForm.valueChanges.subscribe(data => this.onEmailValueChanged(data));
//     this.onEmailValueChanged(); // (re)set validation messages now
//   }
//   onEmailValueChanged(data?: any) {
//     if (!this.emailForm) { return; }
//     const form = this.emailForm;

//     for (const field in this.formErrors) {
//       // clear previous error message (if any)
//       this.formErrors[field] = '';
//       const control = form.get(field);

//       if (control && control.dirty && !control.valid) {
//         const messages = this.validationMessages[field];
//         for (const key in control.errors) {
//           this.formErrors[field] += messages[key] + ' ';
//         }
//       }
//     }
//   }
//   // Add each of the form fields here that have validation
//   formErrors = {
//     'email': '',
//     // 'name': '',
//   };
//   // Add all the possible errors for each form field
//   validationMessages = {
//     'email': {
//       'required': 'Email is required.',
//       'minlength': 'Email must be at least 4 characters long.',
//       'forbiddenValue': 'Invalid email format'
//     },
//     // 'name': {
//     //   'required': 'Name is required.'
//     // }
//   };

import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';
/** Check value against the given regular expression */
/**
 * @ignore
 */
export function customValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const name = control.value;
    const no = !nameRe.test(name);
    // console.log('customValidator name:' + name + ' no:' + no);
    return no ? {'forbiddenValue': {name}} : null;
  };
}
/**
 * @class
 * @ignore
 */
@Directive({
  selector: '[forbiddenValue]',
  providers: [{provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true}]
})
export class CustomValidatorDirective implements Validator, OnChanges {
  @Input() forbiddenValue: string;
  private valFn = Validators.nullValidator;

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['forbiddenValue'];
    if (change) {
      const val: string | RegExp = change.currentValue;
      const re = val instanceof RegExp ? val : new RegExp(val, 'i');
      this.valFn = customValidator(re);
    } else {
      this.valFn = Validators.nullValidator;
    }
  }

  validate(control: AbstractControl): {[key: string]: any} {
    return this.valFn(control);
  }
}
