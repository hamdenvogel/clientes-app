import { Component, Input, OnInit } from '@angular/core';
import { Alert } from '../alert';

@Component({
  selector: 'app-alert-message-form',
  templateUrl: './alert-message-form.component.html',
  styleUrls: ['./alert-message-form.component.css']
})
export class AlertMessageFormComponent implements OnInit {

  dismissible = true;

  @Input() listAlerts: Alert[] = [];

  constructor() { }

  ngOnInit(): void {
    this.dismissible = true;
  }

}
