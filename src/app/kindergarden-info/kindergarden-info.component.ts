import { Component, OnInit } from '@angular/core';
import { StoreService } from '../shared/store.service';
import { BackendService } from '../shared/backend.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-kindergarden-info',
  templateUrl: './kindergarden-info.component.html',
  styleUrls: ['./kindergarden-info.component.scss']
})

export class KindergardenInfoComponent implements OnInit {
  kindergarten: any;

  constructor(
    public storeService: StoreService,
    public backendService: BackendService,
    private route: ActivatedRoute,) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const kindergartenId = +params['id'];
      this.kindergarten = this.backendService.getKindergartenById(kindergartenId);
    });
  }
}
