import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmationModal } from '../../shared/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmationModal],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.scss'
})

export class Proyectos implements OnInit {
  projects: any[] = [];
  tasks: any[] = [];
  showConfirmationModal: boolean = false;
  projectIdToDelete: number | null = null;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const data = this.route.snapshot.data['proyectosData'];
    if (data) {
      this.projects = data.map((user: any) => ({
        id: user.id,
        title: user.name,
        description: user.email
      }));
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
    }
    this.projectIdToDelete = null;
  }
}
