import { Component } from "@angular/core";
import {  NgModel } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})

export class SignupComponent {
  isLoading = false;
  constructor(public authService: AuthService){}

  onSignup(form: NgModel){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createdUser(form.value.email, form.value.password);
  }
}
