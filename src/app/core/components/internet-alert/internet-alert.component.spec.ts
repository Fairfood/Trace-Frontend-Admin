import { TestBed, ComponentFixture } from '@angular/core/testing';
import { InternetAlertComponent } from './internet-alert.component';

describe('InternetAlertComponent', () => {
  let component: InternetAlertComponent;
  let fixture: ComponentFixture<InternetAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternetAlertComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternetAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should hide both alerts initially', () => {
    const offlineAlert = fixture.nativeElement.querySelector('.alert-danger');
    const onlineAlert = fixture.nativeElement.querySelector('.alert-success');
    expect(offlineAlert).toBeFalsy();
    expect(onlineAlert).toBeFalsy();
  });

  it('should show offline alert when the window goes offline', () => {
    const event = new Event('offline');
    window.dispatchEvent(event);
    fixture.detectChanges();
    const offlineAlert = fixture.nativeElement.querySelector('.alert-danger');
    const onlineAlert = fixture.nativeElement.querySelector('.alert-success');
    expect(offlineAlert).toBeTruthy();
    expect(onlineAlert).toBeFalsy();
  });

  it('should show online alert when the window comes back online', () => {
    const offlineEvent = new Event('offline');
    window.dispatchEvent(offlineEvent);
    fixture.detectChanges();
    const onlineEvent = new Event('online');
    window.dispatchEvent(onlineEvent);
    fixture.detectChanges();
    const offlineAlert = fixture.nativeElement.querySelector('.alert-danger');
    const onlineAlert = fixture.nativeElement.querySelector('.alert-success');
    expect(offlineAlert).toBeFalsy();
    expect(onlineAlert).toBeTruthy();
  });
});
