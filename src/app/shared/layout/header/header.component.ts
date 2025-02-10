import {Component, Input} from '@angular/core';
import {CategoryType} from '../../../../types/category.type';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() categories: CategoryType[] = [];
}
