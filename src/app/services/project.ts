import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private tasksApiUrl = 'https://jsonplaceholder.typicode.com/todos';
  private localStorageKey = 'proyectosData';
  private tasksLocalStorageKey = 'tareasData';

  private projectUpdatedSource = new Subject<any>();
  projectUpdated$ = this.projectUpdatedSource.asObservable();

  constructor(private http: HttpClient, private api: Api) { }

  getProjects(): Observable<any[]> {
    const proyectosGuardados = localStorage.getItem(this.localStorageKey);
    if (proyectosGuardados) {
      return of(JSON.parse(proyectosGuardados));
    } else {
      return this.http.get<any[]>(this.apiUrl).pipe(
        tap(projects => {
          this.saveToLocalStorage(projects);
        })
      );
    }
  }

  getProjectById(id: number): Observable<any> {
    const proyectos = this.getProjectsFromLocalStorage();
    const project = proyectos.find(p => p.id === id);
    
    if (project) {
      return of(project);
    } else {
      return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
  }

  getProjectTasks(userId: number): Observable<any[]> {
    const storedTasks = this.getTasksFromLocalStorage();
    const projectTasks = storedTasks.filter(task => task.userId === userId);

    if (projectTasks.length > 0) {
      return of(projectTasks);
    } else {
      const params = new HttpParams().set('userId', userId.toString());
      return this.http.get<any[]>(this.tasksApiUrl, { params }).pipe(
        tap(tasks => {
          this.saveTasksToLocalStorage(tasks);
        }),
        map(tasks => tasks.filter(task => task.userId === userId))
      );
    }
  }

  addTaskToLocalStorage(task: any): void {
    const tasks = this.getTasksFromLocalStorage();
    tasks.push(task);
    this.saveTasksToLocalStorage(tasks);
  }

  updateTaskInLocalStorage(updatedTask: any): void {
    const tasks = this.getTasksFromLocalStorage();
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      this.saveTasksToLocalStorage(tasks);
    }
  }

  deleteTaskFromLocalStorage(taskId: number): void {
    let tasks = this.getTasksFromLocalStorage();
    tasks = tasks.filter(t => t.id !== taskId);
    this.saveTasksToLocalStorage(tasks);
  }

  private saveTasksToLocalStorage(tasks: any[]): void {
    localStorage.setItem(this.tasksLocalStorageKey, JSON.stringify(tasks));
  }

  private getTasksFromLocalStorage(): any[] {
    const tasks = localStorage.getItem(this.tasksLocalStorageKey);
    return tasks ? JSON.parse(tasks) : [];
  }

  updateProject(id: number, project: any): Observable<any> {
    const updatedProject = { ...project, id };

    const proyectos = this.getProjectsFromLocalStorage();
    const index = proyectos.findIndex(p => p.id === id);
    if (index !== -1) {
      proyectos[index] = updatedProject;
      this.saveToLocalStorage(proyectos);
      console.log('Proyecto actualizado en el localStorage.');
    }

    this.projectUpdatedSource.next(updatedProject);

    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedProject);
  }

  private saveToLocalStorage(projects: any[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(projects));
  }

  private getProjectsFromLocalStorage(): any[] {
    const proyectos = localStorage.getItem(this.localStorageKey);
    return proyectos ? JSON.parse(proyectos) : [];
  }
}
