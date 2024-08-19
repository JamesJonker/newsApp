import { Component, Input, Output, EventEmitter  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  @Input() isSelected: string = "";

  @Output() messageEvent = new EventEmitter<string>();

  username: string = '';
  password: string = '';


  errorMessage: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  loginUser() {
    const userData = { username: this.username, password: this.password };

    this.authService.loginUser(userData).subscribe(
      response => {
        console.log('Login successful', response);
        // Handle successful login
        this.sendMessage("LoggedIn")
      },
      error => {
        console.error('Login failed', error);
        // Handle login error
        this.errorMessage = error.error.message;
        this.username = "";
        this.password = "";

      }
    );
  }

  sendMessage(returnMessage: string) {
    this.messageEvent.emit(returnMessage);
  }
}