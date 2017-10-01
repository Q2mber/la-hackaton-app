import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentPopupComponent } from './upload-document-popup.component';

describe('UploadDocumentPopupComponent', () => {
  let component: UploadDocumentPopupComponent;
  let fixture: ComponentFixture<UploadDocumentPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDocumentPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocumentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
