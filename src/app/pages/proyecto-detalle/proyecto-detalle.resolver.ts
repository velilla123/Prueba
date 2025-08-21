import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from '../../services/project';

@Injectable({
  providedIn: 'root'
})

export class ProyectoDetalleResolver implements Resolve<any> {
  constructor(private projectService: ProjectService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const id = route.paramMap.get('id');
    console.log('Resolviendo datos para el proyecto con ID:', id);
    if (id) {
      return this.projectService.getProjectById(parseInt(id, 10));
    }
    return new Observable();
  }
}