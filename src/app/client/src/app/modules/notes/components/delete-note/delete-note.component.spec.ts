import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { NotesService } from '../../services';
import { UserService, ContentService, LearnerService, CoreModule } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { response } from './delete-note-component.spec.data';
import { mockUserData } from './../../../core/services/user/user.mock.spec.data';
import { DeleteNoteComponent } from './delete-note.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DeleteNoteComponent', () => {
  let component: DeleteNoteComponent;
  let fixture: ComponentFixture<DeleteNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, HttpClientTestingModule, Ng2IziToastModule, FormsModule, SharedModule.forRoot(), CoreModule.forRoot()],
      declarations: [DeleteNoteComponent],
      providers: [NotesService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteNoteComponent);
    component = fixture.componentInstance;
    component.deleteNote = response.note;
  });

  it('Should make remove api call and get success response', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const resourceService = TestBed.get(ResourceService);
    component.deleteNote.id = '01250042257192550484';
    spyOn(component.deleteEventEmitter, 'emit');
    spyOn(learnerService, 'get').and.returnValue(Observable.of(mockUserData.success));
    spyOn(notesService, 'remove').and.returnValue(Observable.of(response.deleteSuccess));
    userService.getUserProfile();
    component.removeNote();
    expect(component.showLoader).toBeFalsy();
    expect(component.deleteEventEmitter.emit).toHaveBeenCalledWith('01250042257192550484');
  });

  it('Should make remove api call and get error response', () => {
    const notesService = TestBed.get(NotesService);
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = response.resourceBundle.messages;
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(learnerService, 'get').and.returnValue(Observable.of(mockUserData.success));
    spyOn(notesService, 'remove').and.callFake(() => Observable.throw(response.deleteFailed));
    userService.getUserProfile();
    component.removeNote();
    expect(component.showLoader).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalled();
  });
});
