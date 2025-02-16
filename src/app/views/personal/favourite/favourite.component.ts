import {Component, OnInit} from '@angular/core';
import {FavouriteService} from '../../../shared/services/favourite.service';
import {FavouriteType} from '../../../../types/favourite.type';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-favourite',
  standalone: false,
  templateUrl: './favourite.component.html',
  styleUrl: './favourite.component.scss'
})
export class FavouriteComponent implements OnInit {
  products: FavouriteType[] = [];
  serverStaticPath = environment.serverStaticPath;

  constructor(private favouriteService: FavouriteService) {
  }

  ngOnInit(): void {
    this.favouriteService.getFavourites()
      .subscribe((data: FavouriteType[] | DefaultResponseType) => {
        console.log(data);
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        this.products = data as FavouriteType[];
      });
  }

  removeFromFavourites(id: string) {
    this.favouriteService.removeFavourite(id)
      .subscribe((data:DefaultResponseType)=>{
        if (data.error){
        //   can make something with an error
          throw new Error(data.message);
        }

        this.products = this.products.filter(item=>item.id !== id);
      })
  }
}
