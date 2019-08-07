import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingService } from '../../../bookings/booking.service';
import { AuthService } from '../../../auth/auth.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  id: string;
  isBookable = false;
  isLoading = false;
  private placeSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private actionsheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.id = paramMap.get('placeId');
      this.isLoading = true;
      let fetchedUserId: string;
      this.authService.userId.pipe(switchMap(userId => {
        if (!userId) {
          throw new Error('No user id found');
        }
        fetchedUserId = userId;
        return this.placesService
        .getPlace(paramMap.get('placeId'));
      })).subscribe(place => {
        this.place = place;
        console.log(place.userId, this.authService.userId, place.userId !== fetchedUserId);
        this.isBookable = place.userId !== fetchedUserId;
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'An error occurred',
          message: 'Could not load place.',
          buttons: [{
            text: 'Okay',
            handler: () => {
              this.router.navigate(['/places/tabs/discover'])
            }
          }]
        }).then(alertEl => {
            alertEl.present();
        });
      });;
      // this.placeSub =  this.placesService
      //     .getPlace(paramMap.get('placeId'))
      //     .subscribe(place => {
      //       this.place = place;
      //       console.log(place.userId, this.authService.userId, place.userId !== this.authService.userId);
      //       this.isBookable = place.userId !== this.authService.userId;
      //       this.isLoading = false;
      //     }, error => {
      //       this.alertCtrl.create({
      //         header: 'An error occurred',
      //         message: 'Could not load place.',
      //         buttons: [{
      //           text: 'Okay',
      //           handler: () => {
      //             this.router.navigate(['/places/tabs/discover'])
      //           }
      //         }]
      //       }).then(alertEl => {
      //           alertEl.present();
      //       });
      //     });
    });
  }
  onBookPlace() {
    // this.router.navigateByUrl('/places/tabs/discover');
    // this.navCtrl.navigateBack('/places/tabs/discover');

    this.actionsheetCtrl
        .create({
          header: 'Choose an Action',
          buttons: [
            {
              text: 'Select Date',
              handler: () => {
                this.openBookingModal('select');
              }
            },
            {
              text: 'Random Date',
              handler: () => {
                this.openBookingModal('random');
              }
            },
            {
              text: 'Cancel',
              role: 'cancel'
            }
          ]
        })
        .then(actionsheetEl => {
          actionsheetEl.present();
        });

  }
  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl
    .create({
      component: CreateBookingComponent,
      componentProps: {selectedPlace: this.place, selectedMode: mode}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
     // console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
       // console.log('Booked');
       const data = resultData.data.bookingData;
       this.loadingCtrl
       .create({
         message: 'Booking place...'
          })
       .then(loadingEl => {
         loadingEl.present();
         this.bookingService.addBooking(
          this.place.id,
          this.place.title,
          this.place.imageUrl,
          data.firstName,
          data.lastName,
          data.guestNumber,
          data.startDate,
          data.endDate
        ).subscribe(() => {
          this.loadingCtrl.dismiss();
        });
       });
      }
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

}
