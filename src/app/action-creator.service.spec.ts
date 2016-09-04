/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ActionCreatorService } from './action-creator.service';

describe('Service: ActionCreator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActionCreatorService]
    });
  });

  it('should ...', inject([ActionCreatorService], (service: ActionCreatorService) => {
    expect(service).toBeTruthy();
  }));
});


