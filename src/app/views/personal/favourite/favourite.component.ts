import {Component, OnInit} from '@angular/core';
import {FavouriteService} from '../../../shared/services/favourite.service';
import {FavouriteType} from '../../../../types/favourite.type';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {environment} from '../../../../environments/environment';
import {CartService} from '../../../shared/services/cart.service';
import {CartType} from '../../../../types/cart.type';

@Component({
  selector: 'app-favourite',
  standalone: false,
  templateUrl: './favourite.component.html',
  styleUrl: './favourite.component.scss'
})
export class FavouriteComponent implements OnInit {
  products: FavouriteType[] = [];
  serverStaticPath = environment.serverStaticPath;
  cart: CartType | null = null;
  count: number = 1;

  constructor(private favouriteService: FavouriteService, private cartService: CartService) {
  }

  ngOnInit(): void {
    this.favouriteService.getFavourites()
      .subscribe((data: FavouriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        this.products = data as FavouriteType[];

        this.cartService.getCart()
          .subscribe((cartData: CartType | DefaultResponseType) => {
            if ((cartData as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }

            this.cart = cartData as CartType;
            if (this.cart && this.cart.items && this.cart.items.length > 0) {
              this.products.forEach(item => {
                const addedInCart = this.cart!.items.find(inCart => inCart.product.id === item.id);
                if (addedInCart) {
                  item.inCart = true;
                  item.quantity = addedInCart.quantity;
                }
              });
            }
          });
      });
  }

  removeFromFavourites(id: string) {
    this.favouriteService.removeFavourite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          //   can make something with an error
          throw new Error(data.message);
        }

        const productToRemove = this.products.find(removeItem => removeItem.id === id);
        if (productToRemove) {
          productToRemove.inCart = false;
        }

        this.products = this.products.filter(item => item.id !== id);
      });
  }

  updateCount(id: string, count: number) {
    if (this.cart) {
      this.cartService.updateCart(id, count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.cart = data as CartType;
        });
    }
  }

  addToCart(id: string) {
    if (this.products) {
      const addedFromFavourite = this.products.find(item=>item.id === id);
      if (addedFromFavourite) {
        addedFromFavourite.inCart = true;
        addedFromFavourite.quantity = this.count;
      }
    }

    this.cartService.updateCart(id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
      });
  }

  removeFromCart(id:string) {
    if (this.products) {
      const removeFromCart = this.products.find(item=>item.id === id);
      if (removeFromCart) {
        removeFromCart.inCart = false;
        removeFromCart.quantity = 0;
      }
    }
    this.cartService.updateCart(id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
      });
  }
}
