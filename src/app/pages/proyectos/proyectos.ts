import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmationModal } from '../../shared/confirmation-modal/confirmation-modal';
import { ProjectService } from '../../services/project'
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AddProject } from "../../shared/add-project/add-project";

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmationModal, FormsModule, AddProject],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.scss'
})

export class Proyectos implements OnInit, OnDestroy {
  projects: any[] = [];
  tasks: any[] = [];
  showConfirmationModal: boolean = false;
  showCreateModal: boolean = false;
  projectIdToDelete: number | null = null;
  private projectUpdatedSubscription: Subscription | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private projectService: ProjectService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const storedProjects = localStorage.getItem('proyectosData');
    if (storedProjects) {
      this.projects = JSON.parse(storedProjects);
    } else {
      this.projectService.getProjects().subscribe(data => {
        this.projects = data;
        localStorage.setItem('proyectosData', JSON.stringify(this.projects));
      });
    }

    this.projectUpdatedSubscription = this.projectService.projectUpdated$.subscribe((updatedProject) => {
      const index = this.projects.findIndex(p => p.id === updatedProject.id);
      if (index !== -1) {
        this.projects[index] = updatedProject;
        this.cdr.detectChanges();
        console.log('Lista de proyectos actualizada localmente.');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.projectUpdatedSubscription) {
      this.projectUpdatedSubscription.unsubscribe();
    }
  }

  onEditProject(projectId: number): void {
    this.router.navigate(['./', projectId], { relativeTo: this.route });
  }

  openConfirmationModal(projectId: number): void {
    this.projectIdToDelete = projectId;
    this.showConfirmationModal = true;
  }

  handleConfirmation(isConfirmed: boolean): void {
    this.showConfirmationModal = false;
    if (isConfirmed && this.projectIdToDelete !== null) {
      this.projects = this.projects.filter(p => p.id !== this.projectIdToDelete);
      localStorage.setItem('proyectosData', JSON.stringify(this.projects));
    }
    this.projectIdToDelete = null;
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  private generateUniqueId(): number {
    return Math.floor(Math.random() * 1000000);
  }

  handleCreate(projectData: any): void {
    const newProject = {
      ...projectData,
      company: { ...projectData.company, name: projectData.company.companyName },
      id: this.generateUniqueId()
    };

    this.projects.push(newProject);
    localStorage.setItem('proyectosData', JSON.stringify(this.projects));
    this.closeCreateModal();
  }
}
