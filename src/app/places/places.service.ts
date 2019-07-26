import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Thane',
      'Cat',
      'https://homepages.cae.wisc.edu/~ece533/images/cat.png',
      111.33
    ),
    new Place(
      'p2',
      'Dombivli',
      'Good',
      'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
      100
    ),
    new Place(
      'p3',
      'Nahur',
      'Better',
      'https://homepages.cae.wisc.edu/~ece533/images/pool.png',
      1999
    )
  ];

  get_places() {
    return [...this._places];
  }
  constructor() { }
  getPlace(id: string){
    return {...this._places.find(p => p.id === id)};
  }
}
