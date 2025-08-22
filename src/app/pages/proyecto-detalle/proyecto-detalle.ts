import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, switchMap, catchError, of } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { ProjectService } from '../../services/project';
import { AddTaskModal } from '../../shared/add-task-modal/add-task-modal';
import { ConfirmationModal } from '../../shared/confirmation-modal/confirmation-modal';
import { ModifyAddress } from "../../shared/modify-address/modify-address";

@Component({
  selector: 'app-proyecto-detalle',
  standalone: true,
  imports: [CommonModule, AddTaskModal, ConfirmationModal, FormsModule, ReactiveFormsModule, ModifyAddress, CardModule, ButtonModule, ToastModule, ProgressSpinnerModule],
  templateUrl: './proyecto-detalle.html',
  styleUrl: './proyecto-detalle.scss',
  providers: [MessageService]
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
  isLoading: boolean = true;

  projectForm!: FormGroup;

  private routeSub: Subscription | undefined;

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private cdr: ChangeDetectorRef, private router: Router, private messageService: MessageService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['',  Validators.required],
      website: ['',  Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        suite: ['',  Validators.required],
        city: ['', Validators.required],
        zipcode: ['', Validators.required]
      }),
      company: this.fb.group({
        name: ['', Validators.required],
        catchPhrase: ['',  Validators.required],
        bs: ['',  Validators.required]
      })
    });

    this.routeSub = this.route.paramMap.pipe(
      switchMap(params => {
        const projectId = params.get('id');
        this.isLoading = true;
        if (projectId) {
          return this.projectService.getProjectById(parseInt(projectId, 10));
        } else {
          this.isLoading = false;
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'ID de proyecto no especificado.', life: 5000 });
          return of(null);
        }
      }),

      switchMap(projectData => {
        if (projectData) {
          this.project = projectData;
          this.projectForm.patchValue({
            name: projectData.name,
            username: projectData.username,
            email: projectData.email,
            phone: projectData.phone,
            website: projectData.website,
            address: projectData.address,
            company: projectData.company
          });

          return this.projectService.getProjectTasks(this.project.id);
        } else {
          this.isLoading = false;
          return of([]);
        }
      }),
      catchError(err => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al cargar los datos del proyecto.', life: 5000 });
        return of(null);
      })
    ).subscribe({
      next: (tasksData) => {
        if (tasksData) {
          this.tasks = tasksData;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error final en la suscripción: ' + err, life: 3000 });
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
      const updatedTask = {
        ...this.selectedTaskToEdit,
        title: taskData.title,
        completed: taskData.completed
      };
      this.projectService.updateTaskInLocalStorage(updatedTask);

      const taskIndex = this.tasks.findIndex(t => t.id === updatedTask.id);
      if (taskIndex > -1) {
        this.tasks[taskIndex] = updatedTask;
      }
    } else {
      const newId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
      const newTask = {
        id: newId,
        userId: this.project.id,
        title: taskData.title,
        completed: taskData.completed
      };
      this.projectService.addTaskToLocalStorage(newTask);

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
      this.projectService.deleteTaskFromLocalStorage(this.taskIdToDelete);
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
    this.openModifyAddress(this.projectForm.get('address')?.value);
  }

  handleAddressUpdate(newAddress: { street: string; suite: string; city: string; zipcode: string }): void {
    this.projectForm.get('address')?.patchValue(newAddress);
    this.closeModifyAddress();
  }

  saveProject(): void {
    if (this.projectForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos requeridos correctamente.', life: 5000 });
      return;
    }

    const updatedProject = {
      ...this.project,
      ...this.projectForm.value
    };

    this.projectService.updateProject(this.project.id, updatedProject).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Proyecto guardado con éxito', life: 3000 });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Hubo un error al guardar el proyecto: ' + err, life: 3000 });
      }
    });
  }
}