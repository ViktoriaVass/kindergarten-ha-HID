import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Kindergarden } from './interfaces/Kindergarden';
import { StoreService } from './store.service';
import { Child, ChildResponse } from './interfaces/Child';
import { Observable, BehaviorSubject } from 'rxjs';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  public childrenPerPage: number = 5;

  setChildrenPerPage(value: number) {
    this.childrenPerPage = value;
  }

  public dataUpdated = new EventEmitter<void>();

  constructor(private http: HttpClient, public storeService: StoreService) { }

  public getKindergardens() {
    this.http.get<Kindergarden[]>('http://localhost:5000/kindergardens').subscribe(data => {
      this.storeService.kindergardens = data;
    });
  }

  public getChildren(page: number): Promise<ChildResponse[]> {
    const url = `http://localhost:5000/childs?_expand=kindergarden&_page=${page}&_limit=${this.childrenPerPage}`;
  
    return new Promise<ChildResponse[]>((resolve, reject) => {
      this.http.get<ChildResponse[]>(url, { observe: 'response' }).subscribe(
        (data) => {
          this.storeService.children = data.body!;
          this.storeService.childrenTotalCount = Number(data.headers.get('X-Total-Count'));
          resolve(data.body!);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  
  

  public addChildData(child: Child, page:  number) {
    this.http.post('http://localhost:5000/childs', child).subscribe(_ => {
      this.getChildren(page);
    })
  }

    public deleteChildData(childId: string, page: number) {
      this.http.delete(`http://localhost:5000/childs/${childId}`).subscribe(_=> {
        this.getChildren(page);
      })
    }
  }