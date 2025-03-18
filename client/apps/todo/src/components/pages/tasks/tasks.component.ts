import { Component, computed, effect, inject, Signal, signal, WritableSignal} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmComponent } from '@client/ui';
import { TasksService } from '../../../services/tasks/tasks.service';
import { SharedMatComponent } from 'libs/ui/src/lib/shared-mat-ui.module';
import { ITask } from 'apps/todo/src/services/tasks/tasks.model';
import { tasksEvents } from 'apps/todo/src/services/tasks/tasks.type';

@Component({
  selector: 'tasks-page',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  imports: [SharedMatComponent, MatCheckboxModule, FormsModule, MatDialogModule]
})
export class TasksComponent {
  private tasksService = inject(TasksService);
  private dialog = inject(MatDialog);
  public tasks: WritableSignal<ITask[]> = signal([]);
  public hasTasks!: Signal<boolean>;

  // Convert Observable to Signal
  description = signal('');
  selectedIndex = signal<number>(-1);


  constructor() {
    this.tasksService.getTasks().subscribe((tasks: ITask[]) => {
      this.tasks.set(tasks);
    });
  }

  ngOnInit() {
    this.tasksService.taskUpdates$.subscribe((message) => {
      const { type, task } = message;
      let updatedTasks = [...this.tasks()];
  
      switch (type) {
        case tasksEvents.added:
          updatedTasks.push(task);
          break;
        case tasksEvents.edited:
          updatedTasks = updatedTasks.map(t => (t._id === task._id ? task : t));
          break;
        case tasksEvents.deleted:
          updatedTasks = updatedTasks.filter(t => t._id !== task._id);
          break;
        case tasksEvents.statusChanged:
          updatedTasks = updatedTasks.map(t => (t._id === task._id ? { ...t, done: task.done } : t));
          break;
      }
  
      this.tasks.set(updatedTasks);
    });
  }

  save(): void {
    if (!this.description()) return;
    const newTask: ITask = {
      _id: "",
      description: this.description(),
      done: false,
    };

    this.tasksService.addTask(newTask).subscribe(() => {
      this.tasks.set([...this.tasks(), newTask]);
      this.description.set(newTask.description);
    });
  }

  toggleStatus(task: ITask): void {
    const updatedList = [...this.tasks()];

    this.tasksService.updateTask(task).subscribe(() => {
      this.tasks.set(updatedList);
    });
  }

  deleteConfirmation(task: ITask): void {
    this.dialog
      .open(ConfirmComponent, {
        width: '15em',
      })
      .afterClosed()
      .subscribe((res: any) => {
        if (res === 'YES') {
          this.tasksService.deleteTask(task).subscribe({
            next: () => {
              this.tasks.set(this.tasks().filter(t => t._id !== task._id));
            },
            error: (err) => {
              console.error('Error deleting task:', err);
            }
          });
        }
      });
  }

  editTask(task: ITask): void {
    const index = this.tasks().findIndex(t => t._id === task._id);
    if (index !== -1) {
      this.selectedIndex.set(index);
      this.description.set(task.description);
    }  
  }

  updateTask(): void {
    if (this.selectedIndex() !== -1) {
      const updatedList = [...this.tasks()];
      const oldTask = updatedList[this.selectedIndex()!];
  
      const updatedTask: ITask = {
        ...oldTask,
        description: this.description(),
      };
  
      this.tasksService.updateTask(updatedTask).subscribe((updatedResponseTask: ITask) => {
        updatedList[this.selectedIndex()!] = updatedResponseTask;
        this.tasks.set(updatedList);
  
        this.description.set('');
        this.selectedIndex.set(-1);
      });
    }
  }
  
}