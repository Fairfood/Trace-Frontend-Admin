import { Component, Input } from '@angular/core';
// common loader for app
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  @Input() loaderText: string;

  @Input() noText: boolean;

  @Input() loaderType: 'type1' | 'type2' | 'type3' | 'default' = 'default';
}
