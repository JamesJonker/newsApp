import { Component, Input, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  @Output() messageEventReg = new EventEmitter<string>();

  username: string = '';
  password: string = '';
  conFirmpassword : string = '';
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  registerUser(){

    const userData = { username: this.username, password: this.password };
    this.authService.registerUser(userData).subscribe({
      next : (res)=> {
        alert("Registration was successful Please contineu to the login page!")
        this.sendMessage("Registered")
    },
    error : (err) => {
      console.log(err);
      if(err?.error?.message === "User with username already exists"){
        alert(err.error.message);
      }else{

        alert("There was an error processing your registration")
      }
  }
    })
  }

  sendMessage(returnMessage: string) {
    console.log("sending message")
    this.messageEventReg.emit(returnMessage);
  }

}