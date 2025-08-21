import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient) { }

  getTasksByUser(userId: number): Observable<any[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
