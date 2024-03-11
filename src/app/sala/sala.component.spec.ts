import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaComponent } from './SalaComponent';

describe('SalaComponent', () => {
  let component: SalaComponent;
  let fixture: ComponentFixture<SalaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalaComponent]
    });
    fixture = TestBed.createComponent(SalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
