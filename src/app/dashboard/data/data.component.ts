import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  @Input() currentPage!: number;
  @Output() selectPageEvent = new EventEmitter<number>();
  
  constructor(public backendService: BackendService, public storeService: StoreService) {}
  
  ngOnInit(): void {
    this.backendService.getChildren(this.pageEvent.pageIndex + 1);
  }

  public cancelRegistration(childId: string) {
    console.log("Page Index: " + this.pageEvent.pageIndex + 1);
    this.backendService.deleteChildData(childId, this.pageEvent.pageIndex + 1);
  }

  displayedColumns: string[] = ['Name', 'Geburtsdatum', 'Alter', 'Kindergarten', 'Kindergarten Name', 'Abmelden'];
  pageSizeOptions: number[] = [2, 5, 10, 25 ];
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

  public changePageSize(event: any) {
    this.pageSize = event.pageSize;

    this.backendService.setChildrenPerPage(event.pageSize);
    
    this.pageEvent.pageIndex = event.pageIndex;
    this.pageEvent.pageSize = event.pageSize;

    this.backendService.getChildren(this.pageEvent.pageIndex + 1);

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
}



