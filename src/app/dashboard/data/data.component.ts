import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';
import { ChangeDetectorRef } from '@angular/core';
import { ChildResponse } from 'src/app/shared/interfaces/Child';

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
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<ChildResponse>([]);
    this.dataSource.sort = this.sort;
    this.fetchDataAndSetDataSource();
  }

  private fetchDataAndSetDataSource(): void {
    this.backendService.getAllChildren().then((data) => {
      this.masterList = data;
      this.updateDataSource();
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
    { field: 'name', header: 'Name' },
    { field: 'birthDate', header: 'Geburtsdatum' },
    { field: 'age', header: 'Alter' },
    { field: 'kindergardens.name', header: 'Kindergarten' },
    { field: 'kindergardens.address', header: 'Kindergarten Adresse' },
    { field: 'abmelden', header: 'Abmelden' },
  ];

  changePageSize(event: any): void {
    this.pageSize = event.pageSize;
    this.pageEvent.pageIndex = event.pageIndex;
    this.pageEvent.pageSize = event.pageSize;

    this.updateDataSource(); // Fetch data and update the data source

    console.log("Value ChildrenPerPage = " + this.backendService.childrenPerPage);
  }
  
  

  getCellValue(column: any, child: any): any {
    if (column.field === 'kindergardens.name' || column.field === 'kindergardens.address') {
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

    // Sort the entire dataset
    this.storeService.children.sort((a: any, b: any) => {
      const valueA = this.getSortValue(a, sortField);
      const valueB = this.getSortValue(b, sortField);

      if (sortField === 'name' || sortField === 'kindergardens.name' || sortField === 'kindergardens.address') {
        return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });

    // Update the data source with sorted data
    this.dataSource.data = this.storeService.children;

    // Update the paginator properties
    this.pageEvent.length = this.storeService.children.length;
    this.pageEvent.pageIndex = 0; // Reset to the first page after sorting

    // Trigger change detection
    this.cdr.detectChanges();
    this.updateDataSource();
  }
}
  
  private getSortValue(item: any, sortField: string): any {
    if (sortField === 'birthDate') {
      return new Date(item[sortField]);
    } else if (sortField === 'age') {
      return this.getAge(item.birthDate);
    } else {
      return item[sortField];
    }
  }
    
  
}