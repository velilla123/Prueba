import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient, private api: Api) { }

  getTasksByUser(userId: number): Observable<any[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
