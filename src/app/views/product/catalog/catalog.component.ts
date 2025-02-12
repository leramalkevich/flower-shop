import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../../shared/services/product.service';
import {ProductType} from '../../../../types/product.type';

@Component({
  selector: 'app-catalog',
  standalone: false,
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
  products: ProductType[] = [];

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.productService.getProducts()
      .subscribe(data => {
        this.products = data.items;
      })
  }

}
