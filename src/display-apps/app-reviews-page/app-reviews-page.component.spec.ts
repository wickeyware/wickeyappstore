import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReviewsPageComponent } from './app-reviews-page.component';

describe('AppReviewsPageComponent', () => {
  let component: AppReviewsPageComponent;
  let fixture: ComponentFixture<AppReviewsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppReviewsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppReviewsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
