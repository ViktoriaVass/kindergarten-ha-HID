import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from 'src/app/shared/backend.service';
import { FilterService } from 'src/app/shared/filter.service';
import { ChildResponse } from 'src/app/shared/interfaces/Child';
import { StoreService } from 'src/app/shared/store.service';


@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})

export class DataComponent implements OnInit {

  @Input() currentPage!: number;
  @Output() selectPageEvent = new EventEmitter<number>();
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  
  dataSource: MatTableDataSource<ChildResponse> = new MatTableDataSource<ChildResponse>([]);
  masterList: ChildResponse[] = [];

  constructor(public backendService: BackendService, 
              public storeService: StoreService,
              private cdr: ChangeDetectorRef,
              public filterService: FilterService ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<ChildResponse>([]);
    this.dataSource.sort = this.sort;
    this.fetchDataAndSetDataSource();
    this.filterService.selectedKindergartenId$.subscribe((selectedKindergartenId) => {
      this.applyKindergartenFilter(selectedKindergartenId);
    });
    this.backendService.dataUpdated.subscribe(() => {
      this.fetchDataAndSetDataSource();
    });
  }

  private applyKindergartenFilter(selectedKindergartenId: string | null): void {
    if (!selectedKindergartenId) {
      // No filter selected, show all data
      this.masterList = this.storeService.children;
    } else {
      // Filter data based on the selected kindergarten
      this.masterList = this.storeService.children.filter((child) => {
        const selectedId = selectedKindergartenId ? +selectedKindergartenId : null;
        
        return child.kindergarden?.id === selectedId;
      });
    }

    // Update the data source and trigger change detection
    this.updateDataSource();
  }

  private fetchDataAndSetDataSource(): void {
    this.backendService.getAllChildren().then((data) => {
      this.masterList = data;
      this.updateDataSource();
      this.storeService.isLoading = false;
    });
  }

  private updateDataSource(): void {
    // Apply sorting to master list
    const sortedData = this.masterList.slice().sort((a, b) => {
      // Implement your custom sorting logic here
      return 0; // Placeholder, replace with actual logic
    });

    // Apply pagination
    const startIndex = this.pageEvent.pageIndex * this.pageEvent.pageSize;
    const endIndex = startIndex + this.pageEvent.pageSize;
    this.dataSource.data = sortedData.slice(startIndex, endIndex);

    // Update the paginator properties
    this.pageEvent.length = sortedData.length;

    // Trigger change detection
    this.cdr.detectChanges();
  }

  public cancelRegistration(childId: string) {
    this.storeService.isLoading = true;
    console.log("Page Index: " + this.pageEvent.pageIndex + 1);
    this.backendService.deleteChildData(childId, this.pageEvent.pageIndex + 1);
  }

  displayedColumns: string[] = ['Name', 'Geburtsdatum', 'Alter', 'Kindergarten', 'Kindergarten Name', 'Abmelden'];
  pageSizeOptions: number[] = [2, 5, 10, 25];
  pageSize: number = this.backendService.childrenPerPage;
  pageEvent: any = {
    pageIndex: 0,
    pageSize: this.backendService.childrenPerPage,
    length: this.backendService.storeService.childrenTotalCount
  };

  get columnFields() {
    return this.columns.map(column => column.field);
  }

  columns = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'birthDate', header: 'Geburtsdatum', sortable: true },
    { field: 'age', header: 'Alter', sortable: true },
    { field: 'registrationDate', header: 'Anmeldedatum', sortable: true },
    { field: 'kindergarden.name', header: 'Kindergarten', sortable: true },
    { field: 'kindergarden.address', header: 'Kindergarten Adresse', sortable: false },
    { field: 'abmelden', header: 'Abmelden', sortable: false },
  ];

  changePageSize(event: any): void {
    this.pageSize = event.pageSize;
    this.pageEvent.pageIndex = event.pageIndex;
    this.pageEvent.pageSize = event.pageSize;

    this.updateDataSource(); // Fetch data and update the data source

    console.log("Value ChildrenPerPage = " + this.backendService.childrenPerPage);
  }

  getCellValue(column: any, child: any): any {
    if (column.field === 'kindergarden.name' || column.field === 'kindergarden.address') {
      return child.kindergarden?.[column.field.split('.')[1]];
    } else if (column.field === 'age') {
      return this.getAge(child.birthDate);
    } else {
      return child[column.field];
    }
  }

  getAge(birthDate: string) {
    var today = new Date();
    var birthDateTimestamp = new Date(birthDate);
    var age = today.getFullYear() - birthDateTimestamp.getFullYear();
    var m = today.getMonth() - birthDateTimestamp.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateTimestamp.getDate())) {
      age--;
    }
    return age;
  }

  sortData(event: any) {
    if (event && event.active && event.direction) {
      const sortDirection = event.direction;
      const sortField = event.active;
  
      this.storeService.children.sort((a: any, b: any) => {
        const valueA = this.getSortValue(a, sortField);
        const valueB = this.getSortValue(b, sortField);
  
        if (sortField === 'name' || sortField === 'kindergarden.name' || sortField === 'kindergarden.address') {
          return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
          return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        }
      });
  
      this.dataSource.data = this.storeService.children;
  
      this.pageEvent.length = this.storeService.children.length;
      this.pageEvent.pageIndex = 0; 
  
      this.cdr.detectChanges();
      this.updateDataSource();
    }
  }
  
  private getSortValue(item: any, sortField: string): any {
    console.log('in get sortValue:', item, " - ", sortField);

    const keys = sortField.split('.');
    const value = this.getNestedValue(item, sortField.split('.'));
    console.log("ItemValue in sV: " + value);
  
    if (sortField === 'birthDate' || sortField === 'registrationDate') {
      return new Date(value);
    } else if (sortField === 'age') {
      return this.getAge(item.birthDate);
    } else {
      return value;
    }
  }
  
  private getNestedValue(item: any, keys: string[]): any {
    return keys.reduce((value, key) => {
      return value !== null && value !== undefined ? value[key] : null;
    }, item);
  }
  
  
  
  
  
}