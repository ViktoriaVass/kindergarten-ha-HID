import { Component, OnInit } from '@angular/core';
import { StoreService } from './shared/store.service';
import { BackendService } from './shared/backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'kindergardenApp';

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.backendService.getKindergardens();
    }
}
