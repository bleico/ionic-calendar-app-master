import { Component } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';
import { ActivatedRoute } from '@angular/router';
import { UserData } from '../../providers/user-data';
import { NavController } from '@ionic/angular';
import { Calendar } from '@ionic-native/calendar/ngx';

@Component({
  selector: 'page-session-detail',
  styleUrls: ['./session-detail.scss'],
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {
  session: any;
  isFavorite = false;
  defaultHref = '';

  constructor(
    private dataProvider: ConferenceData,
    private userProvider: UserData,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private calendar: Calendar
  ) { }

  ionViewWillEnter() {
    this.dataProvider.load().subscribe((data: any) => {
      if (data && data.schedule && data.schedule[0] && data.schedule[0].groups) {
        const sessionId = this.route.snapshot.paramMap.get('sessionId');
        for (const group of data.schedule[0].groups) {
          if (group && group.sessions) {
            for (const session of group.sessions) {

              if (session && session.id === sessionId) {
                this.session = session;

                this.isFavorite = this.userProvider.hasFavorite(
                  this.session.name
                );

                break;
              }
            }
          }
        }
      }
    });
  }

  ionViewDidEnter() {
    this.defaultHref = `/app/tabs/schedule`;
  }

  sessionClick(item: string) {
    console.log('Clicked', item);
  }

  toggleFavorite() {
    if (this.userProvider.hasFavorite(this.session.name)) {
      this.userProvider.removeFavorite(this.session.name);
      this.isFavorite = false;
    } else {
      this.userProvider.addFavorite(this.session.name);
      this.isFavorite = true;
    }
  }

  shareSession() {
    console.log('Clicked share session');
  }

  // desde aqui es el uso del calendario nativo
  openCal(id) {
    /*
        this.router.navigate(['CalDetailsPage', {
          name: cal.name
        }]);
    */
    console.log(id);
    console.log(this.session.id);
    console.log('Session', this.session);
    this.calendar.findEventWithOptions(this.session.id).then((msg) => {
      console.log(msg);
      console.log('Nombre', this.session.name);
      this.calendar.openCalendar((this.session.id)).then((msg2) => {
        console.log(msg2);
        console.log('Nombre', this.session.name);
      }).catch((err2) => {
        console.log(err2);
      });
    }, (err) => { console.log(err); }
    );

  }
  addCalendar(id) {
    const createCalOptions = this.calendar.getCreateCalendarOptions();
    createCalOptions.calendarName = 'Your24/7Doc';
    this.calendar.createCalendar(createCalOptions.calendarName).then(() => {

      const options = {
        // calendarId: cal.id,
        calendarName: createCalOptions.calendarName,
        firstReminderMinutes: 5,
        location: this.session.location,
        calendarId: this.session.id,
        timeStart: this.session.timeStart,
        timeEnd: this.session.timeEnd,
        description: this.session.description,

      };
      this.calendar.createEventInteractivelyWithOptions(
          this.session.name,
          this.session.location,
          this.session.description,
          this.session.timeStart,
          this.session.timeEnd,
          options
        )
        .then(
          res => { },
          err => {
            console.log('err: ', err);
          }
        );
    }).catch((error) =>
      console.log(error));
  }
}
