import { TestBed } from '@angular/core/testing';

import { ProductType } from './product-type';

describe('ProductType', () => {
  let service: ProductType;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductType);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
