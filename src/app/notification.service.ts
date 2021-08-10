import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) {}

  showToasterSuccess(Message: string, Title: string){
    this.toastr.success(Message, Title,
    { progressBar: true,
      closeButton: true });
  }

  showToasterError(Message: string, Title: string){
    this.toastr.error(Message, Title,
    { progressBar: true,
      closeButton: true });
  }

  showToasterInfo(Message: string, Title: string){
    this.toastr.warning(Message, Title,
    { progressBar: true,
      closeButton: true });
  }

}
