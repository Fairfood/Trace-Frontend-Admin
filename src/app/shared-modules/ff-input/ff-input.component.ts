/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ff-input',
  templateUrl: './ff-input.component.html',
  styleUrls: ['./ff-input.component.scss'],
})
export class FairFoodInputComponent {
  @Input() parentFormGroup: FormGroup;
  @Input() controlName: any;
  @Input() label: any;
  @Input() inputSize: string;
  @Input() inputType: string;
  @Input() isTextarea: boolean;
}
