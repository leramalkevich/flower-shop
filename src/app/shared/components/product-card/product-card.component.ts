import {Component, Input} from '@angular/core';
import {ProductType} from '../../../../types/product.type';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input()product!:ProductType;
  serverStaticPath = environment.serverStaticPath;
  count: number = 1;
}
