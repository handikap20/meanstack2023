  import { Component } from "@angular/core";
  import {  NgModel } from "@angular/forms";
import { AuthService } from "../auth.service";

  @Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
  })

  export class LoginComponent {
    isLoading = false;

    constructor(public authService: AuthService){}

    onLogin(form: NgModel){
      if(form.invalid){
        return;
      }
      this.isLoading = true;
      this.authService.login(form.value.email, form.value.password);
    }

  }
