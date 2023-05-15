import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/users/user.service';

interface ResetPasswordRequest {
  token: string;
  password: string;
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  token = '';
  password = '';
  errorMessage = '';
  resetSuccessMessage = '';

  constructor(private userService: UserService) {}

  resetPasswordOld() {
    this.errorMessage = '';
    this.resetSuccessMessage = '';

    const requestData: ResetPasswordRequest = {
      token: this.token,
      password: this.password
    };
  }


  resetPassword(){
    this.userService.newPassword(this.password, this.token)    
      .subscribe(
        response => {
          this.resetSuccessMessage = response;
          console.log("Response do new password", response);
          
        },
        error => {
          this.errorMessage = error.error;
          console.log("Error do new password", error);
        }
    );
  }
}
