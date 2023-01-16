  import { Component,OnInit,OnDestroy } from "@angular/core";
  import {  NgModel } from "@angular/forms";
import { AuthService } from "../auth.service";

import { Subscription } from "rxjs";

  @Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
  })

  export class LoginComponent {
    isLoading = false;
    private authStatusSub : Subscription;
    constructor(public authService: AuthService){}

    ngOnInit() {
      this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
        this.isLoading = false;
      });
    }

    onLogin(form: NgModel){
      if(form.invalid){
        return;
      }
      this.isLoading = true;
      this.authService.login(form.value.email, form.value.password);
    }

    ngOnDestroy(){
      this.authStatusSub.unsubscribe();
  }

  }
