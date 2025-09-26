import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { INewResponse, IResponse, Task, TaskPriority, TaskStatus } from '../../interfaces/iresponses';
import { AppServicesService } from '../../services/app-services.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const now = new Date(); // September 25, 2025, 8:06 PM EDT
    const inputDate = new Date(control.value);
    return inputDate > now ? null : { futureDate: 'Due date must be in the future' };
  };
}

@Component({
  selector: 'app-task-form',
  imports: [CommonModule,FormsModule,RouterModule,ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  taskForm: FormGroup;
  taskStatus = TaskStatus;
  taskPriority = TaskPriority;
  isEdit: boolean = false;
  taskId?: number;
  error: string | null = null;
  loading: boolean = false;
  submitButtonId: string = 'submit-task-btn';
  minDate: string | null = null;
  constructor(
    private fb: FormBuilder,
    private taskService: AppServicesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      dueDate: ['', Validators.required],
      status: [TaskStatus.Pending, Validators.required],
      priority: [TaskPriority.Medium, Validators.required]
    });
  }

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.params['id']);
    if (this.taskId) {
      this.isEdit = true;
      this.loading = true;
      this.taskService.DisableButtonWithLoading(this.submitButtonId);
      this.taskService.getTask(this.taskId).subscribe({
        next: (response: IResponse<Task>) => {
          if (!response.isError && response.data) {
            const task = response.data as Task;
            this.taskForm.patchValue({
              title: task.title,
              description: task.description,
              dueDate: new Date(task.dueDate).toISOString().split('T')[0], // Format for input[type=date]
              status: task.status,
              priority: task.priority
            });
          } else {
            this.error = response.msg || 'Failed to load task';
          }
          this.loading = false;
          this.taskService.EnableButtonWithOriginalText(this.submitButtonId);
        },
        error: (err) => {
          this.error = err.msg || 'An error occurred';
          this.loading = false;
          this.taskService.EnableButtonWithOriginalText(this.submitButtonId);
        }
      });
    }else {
      // Create mode: Apply future date validation and minDate
      const now = new Date(); // September 25, 2025
      this.minDate = now.toISOString().split('T')[0]; // 2025-09-25
      this.taskForm.get('dueDate')?.addValidators(futureDateValidator());
      this.taskForm.get('dueDate')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.taskService.DisableButtonWithLoading(this.submitButtonId);

    const task: Task = {
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      dueDate: new Date(this.taskForm.value.dueDate).toISOString(),
      dateCreated: this.isEdit ? this.taskForm.value.dateCreated : new Date().toISOString(),
      isActive: true,
      status: this.taskForm.value.status,
      priority: this.taskForm.value.priority
    };

     if (this.isEdit && this.taskId) {
      // Handle updateTask
      this.taskService.updateTask(this.taskId, task).subscribe({
        next: (response: IResponse<void>) => {
          if (!response.isError) {
            this.router.navigate(['/tasks']);
          } else {
            this.error = response.msg || 'Failed to update task';
          }
          this.loading = false;
          this.taskService.EnableButtonWithOriginalText(this.submitButtonId);
        },
        error: (err: IResponse<unknown>) => {
          this.error = err.msg || 'An error occurred';
          this.loading = false;
          this.taskService.EnableButtonWithOriginalText(this.submitButtonId);
        }
      });
    } else {
      // Handle createTask
      this.taskService.createTask(task).subscribe({
        next: (response: IResponse<Task>) => {
          if (!response.isError) {
            this.router.navigate(['/tasks']);
          } else {
            this.error = response.msg || 'Failed to create task';
          }
          this.loading = false;
          this.taskService.EnableButtonWithOriginalText(this.submitButtonId);
        },
        error: (err: IResponse<unknown>) => {
          this.error = err.msg || 'An error occurred';
          this.loading = false;
          this.taskService.EnableButtonWithOriginalText(this.submitButtonId);
        }
      });
    }
  }
  get minDueDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
