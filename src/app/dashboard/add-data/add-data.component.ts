import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';
import { NgZone } from '@angular/core';


@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})
export class AddDataComponent implements OnInit {

  constructor(private formbuilder: FormBuilder,
    public storeService: StoreService,
    public backendService: BackendService,
    private zone: NgZone) {
  }


  public addChildForm: any;
  @Input() currentPage!: number;
  @Output() selectPageEvent = new EventEmitter<number>();

  showModal: boolean = false;

  ngOnInit(): void {
    this.addChildForm = this.formbuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      kindergardenId: ['', [Validators.required]],
      birthDate: [null, [Validators.required]]
    })
    this.addChildForm.patchValue({ registrationDate: new Date() });
  }

  pageSize: number = this.backendService.childrenPerPage;
  pageEvent: any = {
    pageIndex: 0,
    pageSize: this.backendService.childrenPerPage,
    length: this.backendService.storeService.childrenTotalCount
  };

  onSubmit() {
    if (this.addChildForm.valid) {
      console.log('In onSubmit');
      this.storeService.isLoading = true;
      const rawBirthDate: Date = this.addChildForm.value.birthDate;
      const formattedBirthDate: string = this.formatDate(rawBirthDate);

      const registrationDate: string = this.formatDate(new Date());

      console.log(formattedBirthDate);
      console.log("Current page: " + this.currentPage);
      console.log("Page Index: " + this.pageEvent.pageIndex + 1);

      this.backendService.addChildData({
        ...this.addChildForm.value,
        birthDate: formattedBirthDate,
        registrationDate
      }, this.currentPage);

    } else {
      console.log('Form validation failed. Please check the form for errors.');
    }
  }

  private formatDate(date: Date): string {
    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1;
    const day: number = date.getDate();

    const formattedMonth: string = month < 10 ? `0${month}` : `${month}`;
    const formattedDay: string = day < 10 ? `0${day}` : `${day}`;

    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  closeModal() {
    this.showModal = false;
  }

  checkValidInput() {
    if (this.addChildForm.valid) {
      this.showModal = true;
    } else {
      this.showModal = false;
    }
    return this.showModal;
  }

}
