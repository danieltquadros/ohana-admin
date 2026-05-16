import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboList } from './combo-list';

describe('ComboList', () => {
  let component: ComboList;
  let fixture: ComponentFixture<ComboList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboList],
    }).compileComponents();

    fixture = TestBed.createComponent(ComboList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
