import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnirSalaComponent } from './unir-sala.component';

describe('UnirSalaComponent', () => {
  let component: UnirSalaComponent;
  let fixture: ComponentFixture<UnirSalaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnirSalaComponent]
    });
    fixture = TestBed.createComponent(UnirSalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
