import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEciQuestComponent } from './new-eci-quest.component';

describe('NewEciQuestComponent', () => {
  let component: NewEciQuestComponent;
  let fixture: ComponentFixture<NewEciQuestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewEciQuestComponent]
    });
    fixture = TestBed.createComponent(NewEciQuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
