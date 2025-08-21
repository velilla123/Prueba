import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private tasksApiUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProjectById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getProjectTasks(userId: number): Observable<any[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<any[]>(this.tasksApiUrl, { params });
  }
}
