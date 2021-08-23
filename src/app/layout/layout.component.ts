import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';

declare var jQuery:any;
declare var $ :any;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  url = "assets/start.js";
  url2 = "assets/start2.js";
  loadAPI : any;
  deviceInfo: DeviceInfo;

  constructor(private deviceDetectorService: DeviceDetectorService) { }

  ngOnInit(){
    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    console.log('this.deviceInfo.deviceType: ' + this.deviceInfo.deviceType);
    this.loadAPI = new Promise(resolve => {
      console.log("resolving promise...");
      if (this.deviceInfo.deviceType == 'desktop') {
        this.loadScript();
      }
      else {
        this.loadScript2();
      }
    });
  }

  public loadScript() {
    console.log("preparing to load...");
    let node = document.createElement("script");
    node.src = this.url;
    node.type = "text/javascript";
    node.async = true;
    node.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node);
}

public loadScript2() {
  console.log("preparing to load 2...");
  let node = document.createElement("script");
  node.src = this.url2;
  node.type = "text/javascript";
  node.async = true;
  node.charset = "utf-8";
  document.getElementsByTagName("head")[0].appendChild(node);
}

}
