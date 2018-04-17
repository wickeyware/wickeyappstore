import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { WasAlert } from '../wasalert/wasalert.dialog';
import { UserService } from '../../../user.service';
/**
* WasSSO
*
* Open the single sign on dialog.
* ```js
* import { WasSSO } from 'wickeyappstore';
* import { MatDialog, MatDialogRef } from '@angular/material';
* ...
* constructor(public dialog: MatDialog) { } // and Inject MatDialog in the constructor
* ...
* this.dialog.open(WasSSO);
* ```
*/
@Component({
  templateUrl: './wassso.dialog.html',
  styleUrls: ['../was.component.css'],
})
export class WasSSO {
/**@ignore*/
  firstFormGroup: FormGroup;
  /**@ignore*/
  secondFormGroup: FormGroup;
  /**@ignore*/
  @ViewChild('stepper') stepper: MatStepper;
/**@ignore*/
  email = new FormControl('', [Validators.required, Validators.email]);
  /**@ignore*/
  token = new FormControl('', [Validators.required, Validators.minLength(6),
  Validators.maxLength(6)]);
  /**@ignore*/
  constructor(
    public dialog: MatDialog,
    public userService: UserService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<WasSSO>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // SET DEFAULT VALUES
    dialogRef.disableClose = true; // do not close by clicking off by default
    if (!this.data) { this.data = {}; } // data may not be defined
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
  /**@ignore*/
  onNoClick(): void {
    this.dialogRef.close();
  }


  /**@ignore*/
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
          data: { title: 'Check email (' + email + ')', body: _alertMessage }
        });
      }, (error) => {
        // <any>error | this casts error to be any
        this.dialog.open(WasAlert, {
          data: { title: 'Attention', body: error }
        });
      });
  }
  /**@ignore*/
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
          data: { title: _alertTitle, body: _alertMessage }
        });
        this.dialogRef.close(res.email);
      }, (error) => {
        // <any>error | this casts error to be any
        this.dialog.open(WasAlert, {
          data: { title: 'Attention', body: error }
        });
      });
  }
}
