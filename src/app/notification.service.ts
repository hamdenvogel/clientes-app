import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  titleSuccess: string[];

  constructor(private toastr: ToastrService) {
    this.titleSuccess = [];
    this.titleSuccess.push('Informação');
  }

  showToasterSuccess(Message: string){
    this.toastr.success(Message, this.titleSuccess[0],
    { progressBar: true,
      closeButton: true });
  }

  showToasterSuccessWithTitle(Message: string, Title: string){
    this.toastr.success(Message, Title,
    { progressBar: true,
      closeButton: true });
  }

  showToasterErrorWithTitle(Message: string, Title: string){
    this.toastr.error(Message, Title,
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
