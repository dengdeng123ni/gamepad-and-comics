import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComicsListV11Component } from './comics-list-v11.component';

describe('ComicsListV11Component', () => {
  let component: ComicsListV11Component;
  let fixture: ComponentFixture<ComicsListV11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComicsListV11Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComicsListV11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
