import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../../shared/services/product.service';
import {ProductType} from '../../../../types/product.type';
import {CategoryService} from '../../../shared/services/category.service';
import {CategoryWithTypeType} from '../../../../types/category-with-type.type';

@Component({
  selector: 'app-catalog',
  standalone: false,
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
  products: ProductType[] = [];
  categoriesWithTypes:CategoryWithTypeType[]=[];

  constructor(private productService: ProductService, private categoryService:CategoryService) {
  }

  ngOnInit(): void {
    this.productService.getProducts()
      .subscribe(data => {
        this.products = data.items;
      });

    this.categoryService.getCategoriesWithTypes()
      .subscribe(data =>{
        console.log(data);
        this.categoriesWithTypes = data;
      })
  }

}
