import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPageComponent } from './location-page.component'

describe('MapPageComponent', () => {
  let component: LocationPageComponent;
  let fixture: ComponentFixture<LocationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
