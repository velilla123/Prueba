import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyAddress } from './modify-address';

describe('ModifyAddress', () => {
  let component: ModifyAddress;
  let fixture: ComponentFixture<ModifyAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
