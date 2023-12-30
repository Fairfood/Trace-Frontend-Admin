import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackBarComponent } from './snack-bar.component';
import {
  MatSnackBarModule,
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

describe('SnackBarComponent', () => {
  let component: SnackBarComponent;
  let fixture: ComponentFixture<SnackBarComponent>;
  let snackBarRef: MatSnackBarRef<SnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      declarations: [SnackBarComponent],
      providers: [
        {
          provide: MatSnackBarRef,
          useValue: {
            dismiss: jasmine.createSpy('dismiss'),
          },
        },
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: { icon: 'Success', message: 'Test Message' },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackBarComponent);
    component = fixture.componentInstance;
    snackBarRef = TestBed.inject(MatSnackBarRef);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the class based on the icon', () => {
    expect(component.getClass).toBe('fontsucces'); // Assuming 'Success' is provided as the icon
  });

  it('should set the icon path based on the icon', () => {
    expect(component.getIcon).toBe('../../../assets/images/success.svg'); // Assuming 'Success' is provided as the icon
  });

  it('should dismiss the snackbar when called', () => {
    component.snackBarRef.dismiss();
    expect(snackBarRef.dismiss).toHaveBeenCalled();
  });

  it('should display the message in the template', () => {
    const messageElement = fixture.nativeElement.querySelector('.mat-select');
    expect(messageElement.textContent).toContain('Test Message');
  });
});
