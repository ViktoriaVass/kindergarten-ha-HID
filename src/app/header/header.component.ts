import { Component, OnInit } from '@angular/core';
import { StoreService } from '../shared/store.service';
import { BackendService } from '../shared/backend.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public title: string = 'Kindergarden-App';

  constructor(
    public storeService: StoreService, 
    public backendService: BackendService) {
  }

  ngOnInit(): void {
  }

}