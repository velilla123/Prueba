import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from '../../services/project';

@Injectable({
  providedIn: 'root'
})
export class ProyectosResolver implements Resolve<any[]> {
  constructor(private projectService: ProjectService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any[]> {
    console.log('Resolviendo datos de proyectos...');
    return this.projectService.getProjects();
  }
}