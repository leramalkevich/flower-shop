import {Component, inject, Input, OnInit} from '@angular/core';
import {CategoryType} from '../../../../types/category.type';
import {AuthService} from '../../../core/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {CategoryWithTypeType} from '../../../../types/category-with-type.type';
import {CartService} from '../../services/cart.service';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {CartType} from '../../../../types/cart.type';

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

  constructor(private authService: AuthService, private router: Router, private cartService: CartService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });
    this.cartService.getCartCount()
      .subscribe((data:DefaultResponseType|{ count: number }) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.count = (data as { count: number }).count;
      });

    this.cartService.count$
      .subscribe(count => {
        this.count = count;
      })
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
}
