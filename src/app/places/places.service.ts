import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places  = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Thane',
      'Cat',
      'https://homepages.cae.wisc.edu/~ece533/images/cat.png',
      111.33,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      'Dombivli',
      'Good',
      'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
      100,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p3',
      'Nahur',
      'Better',
      'https://homepages.cae.wisc.edu/~ece533/images/pool.png',
      1999,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    )
  ]);

  get_places() {
    return this._places.asObservable();
  }
  constructor(private authService: AuthService) { }
  getPlace(id: string) {
    this.places.pipe(take(1));
    return {...this._places.find(p => p.id === id)};
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace =
    new Place(
      Math.random().toString(),
      title, description,
      'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
      price,
      dateFrom,
      dateTo,
      this.authService.userId );
      this._places.pipe(take(1)).Subscribe(places => {
        this._places.next(places.concat(newPlace));
      });
   // this._places.push(newPlace);
   // console.log(this._places);
  //   this.places.pipe(take(1)).subscribe(places => {
  //   this._places.next(places.concat(newPlace));
  //  });
  }
}
