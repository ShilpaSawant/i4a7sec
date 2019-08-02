import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';
import { NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  place: Place;
  id: string;
  form: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService, 
    private navCtrl: NavController
    ) { }


  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('dd', {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl('ee', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      })
    });
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')){
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
      this.id = paramMap.get('placeId');
      // this.form = new FormGroup({
      //   title: new FormControl(this.place.title, {
      //     updateOn: 'blur',
      //     validators: [Validators.required]
      //   }),
      //   description: new FormControl(this.place.description, {
      //     updateOn: 'blur',
      //     validators: [Validators.required, Validators.maxLength(180)]
      //   })
      // });
    });
  }

  onUpdateOffer() {
    if (!this.form.valid){
      return;
    }
    console.log(this.form);
  }

}
