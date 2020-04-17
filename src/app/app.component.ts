import { Component, OnInit, ViewEncapsulation, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { MenuController, Platform, ToastController, IonRouterOutlet } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Storage } from '@ionic/storage';

import { UserData } from './providers/user-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: 'Schedule',
      url: '/app/tabs/schedule',
      icon: 'calendar'
    },
    {
      title: 'Speakers',
      url: '/app/tabs/speakers',
      icon: 'people'
    },
    {
      title: 'Map',
      url: '/app/tabs/map',
      icon: 'map'
    },
    {
      title: 'About',
      url: '/app/tabs/about',
      icon: 'information-circle'
    }
  ];
  loggedIn = false;
  dark = false;
  @ViewChild(IonRouterOutlet, { static: false }) routerOutlet: IonRouterOutlet;
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();

    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  checkLoginStatus() {
    return this.userData.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }

  logout() {
    this.userData.logout().then(() => {
      return this.router.navigateByUrl('/app/tabs/schedule');
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }

  registerHardwareBackButton() {
    this.platform.backButton.subscribeWithPriority(0, async () => {
        console.log('Entrando al primer Hardware Back Button');

        // first close any alets, modal etc.

        if (this.routerOutlet && this.routerOutlet.canGoBack()) {
            console.log('Regresamos a posicion anterior');
            this.routerOutlet.pop();
        } else if (this.router.url === '/schedule') {
            console.log('Salimos');
            navigator['app'].exitApp();
        }
        /*
        try {
                 const element = await this.popoverCtrl.getTop();
                 if (element) { console.log('Regresamos'); element.dismiss(); return; }
               } catch (error) { }
        try {
                 const element = await this.modalCtrl.getTop();
                 if (element) { console.log('Regresamos'); element.dismiss(); return; }
               } catch (error) { }
        try {
                 const element = await this.alertController.getTop();
                 if (element) { console.log('Regresamos'); element.dismiss(); return; }
               } catch (error) { }
               */
            });
/*
        let url;
        let index;

        if (this.navLinksArray.length > 1) {
            console.log('Array', this.navLinksArray);
            console.log('Posicion del Array', this.navLinksArray.length);
            this.navLinksArray.pop();
            console.log('Cambiando posicion', this.navLinksArray.pop());
            index = this.navLinksArray.length + 1;
            console.log('Direccion index', index);
            url = this.navLinksArray[index];
            console.log('Otra posicion', url);
            console.log('Direccion url a la que voy', url);
            this.presentAlertConfirm();
            this.router.navigate([url]);
        } else if (this.navLinksArray.length === 1) {
            console.log('Saliendo');
            navigator['app'].exitApp();
        }
    });
    console.log('Saliendo del primer Hardware Back Button');*/
}
/*
backButtonEvent() {
    console.log('backbutton');
    this.platform.backButton.subscribeWithPriority(0, async () => {
        console.log('backbutton1');
        if (this.routerOutlets && this.routerOutlets.canGoBack()) {
            this.routerOutlets.pop();
            console.log('Router Pop', this.routerOutlets.pop());
            console.log('Router URL', this.router.url);
        } else if (this.router.url === '/login') {
            if (new Date().getTime() - this.lastTimeBackPress >= this.timePeriodToExit) {
                this.lastTimeBackPress = new Date().getTime();
                this.presentAlertConfirm();
            } else {
                navigator['app'].exitApp();
            }
        }
    });
  }
   */

}
