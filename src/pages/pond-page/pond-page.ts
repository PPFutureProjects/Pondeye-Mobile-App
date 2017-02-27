import {Component} from '@angular/core';
import {NavController, ActionSheetController, NavParams, LoadingController, AlertController,  Platform} from 'ionic-angular';

import {PostService} from '../../services/post-service';
import {PostPage} from "../post/post";
import {UserPage} from "../user/user";
import {NewPostPage} from "../new-post/new-post";
import {Camera} from 'ionic-native';
import {NewPostServices} from '../../services/new-post-service';
import {SettingsService} from '../../services/settings-service';
import {NewPictureUploadPage} from '../pictureUpload/pictureUpload';
import {MilestonePage} from '../milestone-page/milestone-page';
import {NotificationService} from '../../services/notification-service';
import {ProjectPage} from '../project-page/project-page';
import {SearchResultPage} from '../search-result-page/search-result-page';
import {PondService} from '../../services/pond-service';
import {UserService} from '../../services/user-service';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
declare var window: any;
@Component({
  selector: 'pond-page',
  templateUrl: 'pond-page.html',
})
export class PondPage {
    private queryWord = "";
    private loader: any;
    private base64Image;
    private milestones = [];
    private noNotification = false;
    private pondData;
    private pond;
    // get sample data only
    private pondId;
    constructor(private nav: NavController,   private userService: UserService, private pondService: PondService, private params: NavParams, private setService: SettingsService, private postService: PostService, public actionSheetCtrl: ActionSheetController,
              public platform: Platform, public loadingCtrl: 
              LoadingController, public alertCtrl: AlertController, public newPostService: NewPostServices) {
            // set sample data
             this.pondId = this.params.get('id');
            this.loader = loadingCtrl.create({
            content: "Getting pond...",
            });
            this.loader.present();
   }

    ngOnInit(): void {
        
        var subcription = this.pondService.getIndividualPond(this.pondId).subscribe((data) => {
            this.pondData = JSON.parse(data);
            if (this.pondData.status == false) {
                var alert_1 = this.showAlert(this.pondData.error);
            }
            else {
                this.pond = this.pondData.pond_info;
            }
        }, (error) => { this.loader.dismiss(); var alert = this.showAlert(error); }, () => {
            console.log("Finished! ");
            this.loader.dismiss();
        });
    };
   viewPond = function (pondId) {
        this.nav.push(UserPage, { id: pondId });
    };
    sendPondRequest = function (pondId) {
        
        var subcription = this.pondService.pondRequest(this.pondId).subscribe((data) => {
            this.pondReq = JSON.parse(data);
            if (this.pondReq.status == false) {
                var alert_2 = this.showAlert(this.pondReq.error);
            }
            else {
                this.showToast("Request Sent!");
            }
        }, (error) => { return alert(error); }, () => { return console.log("Finished! "); });
    };
  viewUser = function (id) {
        this.nav.push(UserPage, { id: id });
    };

    viewProfile = function (id) {
        this.nav.setRoot(UserPage, { id: id });
    };

    search = function (ev) {
        var queryWord = ev.target.value;
        if (queryWord.length > 0) {
            this.nav.setRoot(SearchResultPage, { queryWord: queryWord });
            console.log(this.queryWord, " query word");
        }
    }

    showAlert = function (mes) {
        var alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: mes,
            buttons: ['OK']
        });
        alert.present();
    };
    showToast = function (mes) {
        this.platform.ready().then(() => {
            window.plugins.toast.show(mes, "short", "top");
        });
    };
 
    // create a new post
    createPost = () => {
        this.nav.push(NewPostPage);
    };
    createPicture = () => {
        this.takePicture();
    };
    takePicture = () => {
        
        Camera .getPicture({
            destinationType: Camera .DestinationType.DATA_URL,
            mediaType: Camera .MediaType.PICTURE,
            encodingType: Camera .EncodingType.JPEG,
            correctOrientation: true
        }).then(function (imageData) {
            this.base64Image = "data:image/jpeg;base64," + imageData;
            this.nav.setRoot(NewPictureUploadPage, { 'fileName': this.base64Image });
        }, function (err) {
            console.log(err);
        });
    };
    
}
