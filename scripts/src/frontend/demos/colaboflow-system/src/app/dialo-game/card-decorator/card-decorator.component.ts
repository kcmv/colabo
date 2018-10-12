import { Component, OnInit, Input } from '@angular/core';
import {CardDecorator} from './cardDecorator';

@Component({
  selector: 'card-decorator',
  templateUrl: './card-decorator.component.html',
  styleUrls: ['./card-decorator.component.css']
})
export class CardDecoratorComponent implements OnInit {
  @Input() decoratorData:CardDecorator;
  constructor() { }

  ngOnInit() {
  }

}
