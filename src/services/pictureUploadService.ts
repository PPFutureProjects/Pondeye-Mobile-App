import { Injectable }  from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {CURRENTURL} from './service-util/URLS'
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
@Injectable()
export class PictureUploadService {
  private chats: any;
  
  constructor(private _http: Http) {
    this.platformUrl = CURRENTURL;
  }
  private platformUrl;


    getMilestonePostData = function () {
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/social/api/new-picture-entry/?username=" + username))
            .map(this.processData).catch(this.processError);
    };
    milPictureUpload = function (picture, type_of_picture, milId) {
        var username = localStorage.getItem("username");
        console.log("upload file ", picture);
        var new_pic = encodeURIComponent(picture);
        var data = "username=" + username + "&picture=" + new_pic + "&type_of_picture=" + type_of_picture + "&milestone_name=" + milId;
        console.log(new_pic);
        var headers = new Headers()
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Content-Transfer-Encoding', 'base64');
        return this._http.post(this.platformUrl + '/social/api/new-picture-entry/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
    profilePictureUpload = function (base64Image, user_id) {
        var username = localStorage.getItem("username");
        var new_pic = encodeURIComponent(base64Image);
        var data = "username=" + username + "&picture=" + new_pic + "&user_id=" + user_id;
        var headers = new Headers()
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/api/add-profile-picture/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
    processData = function (res) {
        var body = JSON.stringify(res.json());
        console.log("body " + body);
        return body || {};
    };
    processError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        var errMsg;
        if (error instanceof  Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg =  true ? error.message : error.toString() + "\Sorry! Please restart the app. Also check your connection!";
        }
        console.error(errMsg);
        return Observable.throw("Sorry! Something went wrong. Make sure you are connected to the internet.");
    };

}
    
