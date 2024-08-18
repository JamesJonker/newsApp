import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'newsApp';

  isPopupVisible : boolean = true;
  
  showIntroPage : boolean = false;

  showLogin : boolean = false;
  showRegister : boolean = false;
  showNews : boolean = false;


  showPopup(): void {
    this.isPopupVisible = true;
  }

  hidePopup(): void {
    this.isPopupVisible = false;
    this.showIntro();
  }

  accepting(){
    this.hidePopup();
  }

  showIntro(){
    this.showIntroPage = true;
    if(this.showIntroPage == true){
      setTimeout(() => {
        this.showIntroPage = false;
        console.log('done')
        // needs to be 30 seconds.
        this.showLogin = true;

      }, 3000);}
  }
  receiveMessage(loginMessage: string){
    if(loginMessage === "Register"){
      this.showLogin = false;
      this.showRegister = true;
    }else{
      if(loginMessage ==="LoggedIn"){
        this.showLogin = false;
        this.showNews = true;
      }
    }
    console.log(loginMessage);
  }

  receiveMessageRegistration(registrationMessage : string){
    if(registrationMessage === 'Cancel'){
      this.showRegister = false;
      this.showLogin = true;
    }
    if(registrationMessage ==='Registered'){
      this.showRegister = false;
      this.showLogin = true;
    }

  }

  receiveMessageNews(messageEventNewsEvent: string){
    console.log("messageEventNews", messageEventNewsEvent);
    this.showRegister = false;
    this.showNews = false;
    this.showIntroPage = false;
    this.showLogin = true;
    
  }
}
