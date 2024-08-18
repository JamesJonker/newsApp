// import { Component } from '@angular/core';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrl: './terms-conditions.component.css'
})
export class TermsConditionsComponent {

  @Input() isVisible: boolean = false;

  @Output() closeEvent = new EventEmitter<void>();

  close(): void {

    this.closeEvent.emit();
    
  }

}
