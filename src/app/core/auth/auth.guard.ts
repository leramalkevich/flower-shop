import { CanActivateFn } from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const _snackBar = inject(MatSnackBar);
  // if (authService.getIsLoggedIn()) {
  //   return true;
  // }
  // return false;

  const isLogged = authService.getIsLoggedIn();
  if (!isLogged) {
    _snackBar.open('Для доступа необходимо авторизоваться')
  }
  return isLogged;
};
