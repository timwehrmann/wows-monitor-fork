import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/components/base.component';
import { Config } from 'src/config/config';

@Component({
  selector: 'app-value-label-mdi',
  templateUrl: './value-label-mdi.component.html'
})
export class ValueLabelMdiComponent extends BaseComponent implements OnInit {

  @Input()
  label: string;

  @Input()
  icon: string;

  @Input()
  position: string;

  constructor(public config: Config) {
    super();
  }

  ngOnInit() {}
}
