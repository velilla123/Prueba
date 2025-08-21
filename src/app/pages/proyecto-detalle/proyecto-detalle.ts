import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project';
import { AddTaskModal } from '../../shared/add-task-modal/add-task-modal';
import { ConfirmationModal } from '../../shared/confirmation-modal/confirmation-modal';
import { FormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';
import { ModifyAddress } from "../../shared/modify-address/modify-address";

@Component({
  selector: 'app-proyecto-detalle',
  standalone: true,
  imports: [CommonModule, AddTaskModal, ConfirmationModal, FormsModule, ModifyAddress],
  templateUrl: './proyecto-detalle.html',
  styleUrl: './proyecto-detalle.scss'
})

export class ProyectoDetalle implements OnInit, OnDestroy {
  project: any | null = null;
  tasks: any[] = [];
  showAddTaskModal = false;
  showConfirmationModal: boolean = false;
  taskIdToDelete: number | null = null;
  selectedTaskToEdit: any | null = null;
  showModifyAddress = false;
  selectedAddressToEdit: any | null = null;

  name: string = '';
  nameUser: string = '';
  email: string = '';
  phone: string = '';
  webSite: string = '';
  address: string = '';

  companyName: string = '';
  catchPhrase: string = '';
  bs: string = '';

  private routeSub: Subscription | undefined;

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const projectId = params.get('id');
      if (projectId) {
        console.log('Cargando detalles del proyecto y tareas para ID:', projectId);
        this.projectService.getProjectById(parseInt(projectId, 10)).subscribe(
          (projectData) => {
            this.project = projectData;
            this.name = projectData.name;
            this.nameUser = projectData.username;
            this.email = projectData.email;
            this.phone = projectData.phone;
            this.webSite = projectData.website;
            this.address = projectData.address.street + projectData.address.suite + projectData.address.city + projectData.address.zipcode;

            this.companyName = projectData.company.name;
            this.catchPhrase = projectData.company.catchPhrase;
            this.bs = projectData.company.bs;

            this.cdr.detectChanges();
            this.projectService.getProjectTasks(this.project.id).subscribe({
              next: (tasksData) => {
                this.tasks = tasksData;
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error('Error al cargar las tareas', err);
              }
            });
          },
          (error) => {
            console.error('Error al cargar los detalles del proyecto', error);
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  closePopup(): void {
    this.router.navigate(['/dashboard/proyectos']);
  }

  saveChanges(): void {
    console.log("Guardando cambios (funcionalidad no implementada en este demo).");
  }

  openAddTaskModal(task: any | null = null): void {
    this.selectedTaskToEdit = task;
    this.showAddTaskModal = true;
  }

  closeAddTaskModal(): void {
    this.showAddTaskModal = false;
    this.selectedTaskToEdit = null;
  }

  editTask(task: any): void {
    this.openAddTaskModal(task);
  }

  handleTaskSave(taskData: { title: string; completed: boolean }): void {
    if (this.selectedTaskToEdit) {
      const taskIndex = this.tasks.findIndex(t => t.id === this.selectedTaskToEdit.id);
      if (taskIndex > -1) {
        this.tasks[taskIndex].title = taskData.title;
        this.tasks[taskIndex].completed = taskData.completed;
      }
    } else {
      const newId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
      const newTask = {
        id: newId,
        userId: this.project.id,
        title: taskData.title,
        completed: taskData.completed
      };
      this.tasks.push(newTask);
    }

    this.closeAddTaskModal();
    this.cdr.detectChanges();
  }

  get completedTasks(): any[] {
    return this.tasks.filter(task => task.completed);
  }

  get incompleteTasks(): any[] {
    return this.tasks.filter(task => !task.completed);
  }

  openConfirmationModal(taskId: number): void {
    this.taskIdToDelete = taskId;
    this.showConfirmationModal = true;
  }

  handleConfirmation(isConfirmed: boolean): void {
    this.showConfirmationModal = false;
    if (isConfirmed && this.taskIdToDelete !== null) {
      this.tasks = this.tasks.filter(p => p.id !== this.taskIdToDelete);
    }
    this.taskIdToDelete = null;
  }

  openModifyAddress(address: any | null = null): void {
    this.selectedAddressToEdit = address;
    this.showModifyAddress = true;
  }

  closeModifyAddress(): void {
    this.showModifyAddress = false;
    this.selectedAddressToEdit = null;
  }

  editAddress(): void {
    this.openModifyAddress(this.project.address);
  }

  addAddress(newAddress: { street: string; suite: string; city: string; zipcode: string }): void {
    if (this.selectedAddressToEdit) {
      this.project['address'] = {
        "street": newAddress.street,
        "suite": newAddress.suite,
        "city": newAddress.city,
        "zipcode": newAddress.zipcode,
      }
      this.address = newAddress.street + ' ' + newAddress.suite + ' ' + newAddress.city + ' ' + newAddress.zipcode;
    }
    this.closeModifyAddress();
  }

  saveProject(): void {

  }
}
