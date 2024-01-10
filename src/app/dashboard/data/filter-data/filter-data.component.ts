import { Component } from '@angular/core';
import { BackendService } from 'src/app/shared/backend.service';
import { FilterService } from 'src/app/shared/filter.service';
import { StoreService } from 'src/app/shared/store.service';

@Component({
  selector: 'app-filter-data',
  templateUrl: './filter-data.component.html',
  styleUrls: ['./filter-data.component.scss']
})
export class FilterDataComponent {
  constructor(public storeService: StoreService,
    public backendService: BackendService,
    public filterServive: FilterService) { };

  selectedKindergartenId: string | null = null;

  applyFilter(): void {
    this.filterServive.setSelectedKindergartenId(this.selectedKindergartenId);
  }

  deleteFilter(): void {
    this.selectedKindergartenId = null;
    this.filterServive.setSelectedKindergartenId(this.selectedKindergartenId);
  }

}
