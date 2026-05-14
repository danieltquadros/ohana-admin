import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientFormDialog } from './ingredient-form-dialog';

describe('IngredientFormDialog', () => {
  let component: IngredientFormDialog;
  let fixture: ComponentFixture<IngredientFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientFormDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(IngredientFormDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
