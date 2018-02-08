import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { WasAlert } from '../wasalert/wasalert.dialog';
import { UserService } from '../../../user.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'wassso-dialog',
  templateUrl: './wassso.dialog.html',
  styleUrls: ['../was.component.css'],
})
export class WasSSO {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  matcher = new MyErrorStateMatcher();
  @ViewChild('stepper') stepper: MatStepper;

  /**
   * THE SSO screen via Dialog Modal
   *
  */

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<WasSSO>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // SET DEFAULT VALUES
    dialogRef.disableClose = true; // do not close by clicking off by default
    if (!this.data) {this.data = {}}; // data may not be defined
    console.log('wassso email', this.data.email);
    if (!this.data.email) {
      this.data.email = '';
    } else {
      // To avoid "ExpressionChangedAfterItHasBeenCheckedError" error set the index in setTimeout
      setTimeout(() => {
        this.stepper.selectedIndex = 1;
      }, 650);
    }

    // init the validators
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
  /**
   * Cancel/close the dialog
   *
   * @memberof WasSSO
   */
  onNoClick(): void {
    this.dialogRef.close();
  }



  tokenPerson(email: string): void {
    // NOTE: If email doesn't exist add to their account, send token, set account to verified after token entered
    this.userService
      .sendToken({ 'token_email': email })
      .subscribe((res) => {
        let _alertMessage = 'The login token was sent. Enter it in token field to finish the login.';
        if (res.new_account) {
          _alertMessage = 'The verification token was sent. Enter it in token field to finish creating account.';
        }
        this.dialog.open(WasAlert, {
          data: { title: 'Check email (' + email + ')', body: _alertMessage, buttons: ['Okay'] }
        });
      }, (error) => {
        // <any>error | this casts error to be any
        this.dialog.open(WasAlert, {
          data: { title: 'Attention', body: error, buttons: ['Okay'] }
        });
      });
  }

  verifyPerson(verification_token: string): void {
    this.userService
      .verifyToken({ 'token': verification_token })
      .subscribe((res) => {
        let _alertTitle = 'Successful login';
        let _alertMessage = 'Log into ' + res.email + ' success!';
        if (res.account_created) {
          _alertTitle = 'Successfully created account';
          _alertMessage = 'Created an account with ' + res.email;
        }
        this.dialog.open(WasAlert, {
          data: { title: _alertTitle, body: _alertMessage, buttons: ['Okay'] }
        });
        this.onNoClick();
      }, (error) => {
        // <any>error | this casts error to be any
        this.dialog.open(WasAlert, {
          data: { title: 'Attention', body: error, buttons: ['Okay'] }
        });
      });
  }
}
