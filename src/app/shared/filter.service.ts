import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private selectedKindergartenIdSubject = new BehaviorSubject<string | null>(null);
  selectedKindergartenId$ = this.selectedKindergartenIdSubject.asObservable();

  setSelectedKindergartenId(kindergartenId: string | null): void {
    this.selectedKindergartenIdSubject.next(kindergartenId);
  }
}