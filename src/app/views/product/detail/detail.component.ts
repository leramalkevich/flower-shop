import {Component, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {ProductService} from '../../../shared/services/product.service';
import {ProductType} from '../../../../types/product.type';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  count:number = 1;
  recommendedProducts:ProductType[]=[];
  product!:ProductType;
  serverStaticPath = environment.serverStaticPath;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin:24,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  }

  constructor(private productService:ProductService, private activatedRoute:ActivatedRoute) {
  }

  ngOnInit():void {
    this.activatedRoute.params.subscribe(params=>{
      this.productService.getProduct(params['url'])
        .subscribe((data:ProductType)=>{
          this.product = data;
        //   здесь можно сделать перевод на 404 страницу если данных вдруг нет
        });
    });

    this.productService.getBestProducts()
      .subscribe((data:ProductType[])=>{
        this.recommendedProducts = data;
      });
  }

  updateCount(value:number){
    console.log(value);
    this.count = value;
  }

  addToCart(){
    alert('Добавлено в корзину: ' + this.count);
  }

}
