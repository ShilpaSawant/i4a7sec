import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: string;
  title: string;
  userId: string;
}


@Injectable({
  providedIn: 'root'
})

// [
//   new Place(
//     'p1',
//     'Thane',
//     'Cat',
//     'https://homepages.cae.wisc.edu/~ece533/images/cat.png',
//     111.33,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
//   new Place(
//     'p2',
//     'Dombivli',
//     'Good',
//     'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
//     100,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'xyz'
//   ),
//   new Place(
//     'p3',
//     'Nahur',
//     'Better',
//     'https://homepages.cae.wisc.edu/~ece533/images/pool.png',
//     1999,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   )
// ]
export class PlacesService {
  public _places  = new BehaviorSubject<Place[]>([]);

  get_places() {
    return this._places.asObservable();
  }
  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces() {
   return this.http
        .get<{ [key: string]: PlaceData}>('https://ionic-angular-course-64e6e.firebaseio.com/offered-places.json')
        .pipe(
          // tap(resData => {
          // console.log(resData);
          // })
          map(resData => {
            const places = [];
            for (const key in resData) {
              if (resData.hasOwnProperty(key)) {
                places.push(
                  new Place(
                    key,
                    resData[key].title,
                    resData[key].description,
                    resData[key].imageUrl,
                    +resData[key].price,
                    new Date(resData[key].availableFrom),
                    new Date(resData[key].availableTo),
                    resData[key].userId
                  )
                )
              }
            }
            return places;
            //return [];
          }),
          tap(places => {
            this._places.next(places);
          })
        );
  }

  getPlace(id: string) {
   return this._places.pipe(take(1),
    map(places => {
      return { ...places.find(p => p.id === id) };
    }));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    let generatedId: string;
    const newPlace =
    new Place(
      Math.random().toString(),
      title, description,
      'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
      price,
      dateFrom,
      dateTo,
      this.authService.userId );
    return this.http
               .post<{name: string}>('https://ionic-angular-course-64e6e.firebaseio.com/offered-places.json',{ ...newPlace, id: null})
               .pipe(
                //  tap(resData => {
                //    console.log(resData);
                //  })
                switchMap(resData => {
                  generatedId = resData.name;
                  return this._places;
                }),
                take(1),
                tap(places => {
                  newPlace.id =generatedId;
                  this._places.next(places.concat(newPlace));
                })
               );
    // return this._places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //   this._places.next(places.concat(newPlace));
    // }));
  }
  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this._places
        .pipe(
          take(1),
          switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId );
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
        oldPlace.id,
        title,
        description,
        oldPlace.imageUrl,
        oldPlace.price,
        oldPlace.availableFrom,
        oldPlace.availableTo,
        oldPlace.userId
        );
        return this.http.put(
          `https://ionic-angular-course-64e6e.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
        tap(() => {
          this._places.next(updatedPlaces);
        })
      );
    // return this._places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //   const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId );
    //   const updatedPlaces = [...places];
    //   const oldPlace = updatedPlaces[updatedPlaceIndex];
    //   updatedPlaces[updatedPlaceIndex] = new Place(
    //     oldPlace.id,
    //     title,
    //     description,
    //     oldPlace.imageUrl,
    //     oldPlace.price,
    //     oldPlace.availableFrom,
    //     oldPlace.availableTo,
    //     oldPlace.userId);
    //   this._places.next(updatedPlaces);

    // }));
  }
}
