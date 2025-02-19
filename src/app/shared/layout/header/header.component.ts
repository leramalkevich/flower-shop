import {Component, HostListener, inject, Input, OnInit} from '@angular/core';
import {CategoryType} from '../../../../types/category.type';
import {AuthService} from '../../../core/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {CategoryWithTypeType} from '../../../../types/category-with-type.type';
import {CartService} from '../../services/cart.service';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {CartType} from '../../../../types/cart.type';
import {ProductService} from '../../services/product.service';
import {ProductType} from '../../../../types/product.type';
import {environment} from '../../../../environments/environment';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  @Input() categories: CategoryWithTypeType[] = [];
  isLogged: boolean = false;
  private _snackBar = inject(MatSnackBar);
  count: number = 0;
  // searchValue: string = '';
  products: ProductType[] = [];
  serverStaticPath = environment.serverStaticPath;
  showedSearch: boolean = false;
  searchField = new FormControl();

  constructor(private authService: AuthService, private router: Router, private cartService: CartService,
              private productService: ProductService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.searchField.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(value=>{
        if (value && value.length > 2) {
              this.productService.searchProducts(value)
                .subscribe((data: ProductType[]) => {
                  this.products = data;
                  this.showedSearch = true;
                });
            } else {
              this.products = [];
            }
      });

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
      this.currentCartCount();
    });

    this.currentCartCount();
    this.cartService.count$
      .subscribe(count => {
        this.count = count;
      });
  }

  currentCartCount() {
    this.cartService.getCartCount()
      .subscribe((data: DefaultResponseType | { count: number }) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.count = (data as { count: number }).count;
      });
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  // changeSearchValue(newValue: string) {
  //   this.searchValue = newValue;
  //   if (this.searchValue && this.searchValue.length > 2) {
  //     this.productService.searchProducts(this.searchValue)
  //       .subscribe((data: ProductType[]) => {
  //         this.products = data;
  //         this.showedSearch = true;
  //       });
  //   } else {
  //     this.products = [];
  //   }
  // }

  selectProduct(url: string) {
    this.router.navigate(['/product/' + url]);
    this.searchField.setValue('');
    // очистив products убирается и блок поиска
    this.products = [];
  }

//к input добавляли
// (blur)="changeShowedSearch(false)" (focus)="changeShowedSearch(true)"
  // changeShowedSearch(value: boolean) {
  //   setTimeout(()=>{
  //     this.showedSearch = value;
  //   }, 100);
  // }

  // отслеживание клика, чтобы убрать блока search (2 variant)
  @HostListener('document:click', ['$event'])
  click(event:Event) {
    if (this.showedSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1) {
      this.showedSearch = false;
    }
  }
}
