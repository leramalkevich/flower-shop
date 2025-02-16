import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {FavouriteType} from '../../../types/favourite.type';
import {DefaultResponseType} from '../../../types/default-response.type';

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  constructor(private http: HttpClient) {
  }

  getFavourites(): Observable<FavouriteType[] | DefaultResponseType> {
    return this.http.get<FavouriteType[] | DefaultResponseType>(environment.api + 'favorites');
  }

  removeFavourite(productId: string): Observable<DefaultResponseType> {
    return this.http.delete<DefaultResponseType>(environment.api + 'favorites', {body: {productId}});
  }

  addFavourite(productId: string): Observable<FavouriteType | DefaultResponseType> {
    return this.http.post<FavouriteType | DefaultResponseType>(environment.api + 'favorites', {productId});
  }
}
