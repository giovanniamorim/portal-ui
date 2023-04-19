import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm!: FormGroup

  constructor(private fb: FormBuilder) { 
    this.createForm();
  }

  ngOnInit(): void {
  }


  createForm(){
    this.changePasswordForm = this.fb.group({
      oldPassword:['', Validators.required],
      newPassword:['', Validators.required],
      confirmPassword:['', Validators.required]
    })
  }

  onSubmit(){
    const oldPassword = this.changePasswordForm.value.oldPassword;
    const newPassword = this.changePasswordForm.value.newPassword;
    const confirmPassword = this.changePasswordForm.value.confirmPassword;

    // TODO: Add password change logic here
  }

}
