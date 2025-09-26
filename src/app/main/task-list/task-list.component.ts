import { Component } from '@angular/core';
import { IResponse, Task, TaskStatus } from '../../interfaces/iresponses';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { AppServicesService } from '../../services/app-services.service';
import { CommonModule } from '@angular/common';
import { PagenationComponent } from '../pagenation/pagenation.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, ConfirmModalComponent,PagenationComponent,RouterModule,FormsModule,NgxPaginationModule,MatSelectModule,MatFormFieldModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
tasks: Task[] = [];
  filteredTasks: Task[] = [];
  taskStatus = TaskStatus;
  statusFilter: TaskStatus | '' = '';
  searchTerm: string = '';
  itemsPerPage: number = 10;
  currentPage: number = 1;
  loading: boolean = false;
  error: string | null = null;
  showDeleteModal: boolean = false;
  deleteTaskId?: number;
  deleteTaskTitle: string = '';
   totalItems = 0;
  pageItemsList = [
    10,
    20,
    25,
    50,
    100
  ]

  constructor(private taskService: AppServicesService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    debugger
    this.loading = true;
    this.taskService.getTasks(this.statusFilter || undefined, this.searchTerm || undefined)
      .subscribe({
        next: (response: IResponse<Task[]>) => {
          if (!response.isError && response.data) {
            this.tasks = response.data as Task[];
            this.applySearchFilter();
            this.totalItems = this.filteredTasks.length;
          } else {
            this.error = response.msg || 'Failed to load tasks';
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = err.msg || 'An error occurred';
          this.loading = false;
        }
      });
  }

  applySearchFilter(): void {
    let filtered = this.tasks;
    if (this.searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    if (this.statusFilter) {
      filtered = filtered.filter(task => task.status === this.statusFilter);
    }
    this.filteredTasks = filtered;
    this.currentPage = 1;
  }

  pageChanged(page: number): void {
    this.currentPage = page;
  }

  popDeleteModal(id: number, title: string, buttonId: string): void {
    this.taskService.DisableButtonWithLoading(buttonId);
    this.deleteTaskId = id;
    this.deleteTaskTitle = title;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteTaskTitle = '';
    if (this.deleteTaskId) {
      this.taskService.EnableButtonWithOriginalText(`delete-task-${this.deleteTaskId}`);
    }
  }

  deleteTask(buttonId: string): void {
    if (this.deleteTaskId) {
      this.taskService.deleteTask(this.deleteTaskId).subscribe({
        next: (response: IResponse<void>) => {
          if (!response.isError) {
            this.loadTasks();
            this.showDeleteModal = false;
            this.deleteTaskId = undefined;
            this.deleteTaskTitle = '';
          } else {
            this.error = response.msg || 'Failed to delete task';
            this.showDeleteModal = false;
          }
          this.taskService.EnableButtonWithOriginalText(buttonId);
        },
        error: (err) => {
          this.error = err.msg || 'An error occurred';
          this.showDeleteModal = false;
          this.taskService.EnableButtonWithOriginalText(buttonId);
        }
      });
    }
  }
}
