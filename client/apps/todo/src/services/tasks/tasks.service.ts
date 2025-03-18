import { Injectable, inject } from '@angular/core';
import { Observable, Subject, tap, timer } from 'rxjs';
import { ManagerService } from '../manager.service';
import { IMessage, tasksEvents, OpType } from './tasks.type';
import { ITask } from './tasks.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private baseUrl = 'http://localhost:8000/api/tasks';
  private wsUrl = `ws://localhost:8000/ws`;
  
  private manager = inject(ManagerService);
  private socket!: WebSocket;
  private taskUpdates = new Subject<IMessage>();

  taskUpdates$ = this.taskUpdates.asObservable();

  constructor() {
    this.connectWebSocket();
  }

  private connectWebSocket() {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("WebSocket Error: No authentication token.");
      return;
    }

    this.socket = new WebSocket(`${this.wsUrl}?token=${token}`);

    this.socket.onopen = () => console.log("WebSocket Connected!");

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.taskUpdates.next(message);
      this.handleTaskEvent(message);
    };

    this.socket.onerror = (error) => console.error("WebSocket Error:", error);
    this.socket.onclose = () => {
      console.warn("WebSocket Disconnected. Reconnecting...");
      timer(3000).subscribe(time => this.connectWebSocket());
    };
  }

  private handleTaskEvent(message: IMessage) {
    const { type, email, task, users} = message;
    if (users && users.length > 0) {
      return;
    }
    const notificationMessage = `${email} ${type} a new task: ${task.description}`;

    if (notificationMessage) {
      this.manager.snack.open(notificationMessage, "Close", { duration: 3000 });
    }
  }

  private sendWebSocketUpdate(type: OpType, task: ITask) {
    const token = localStorage.getItem('token');
    if (token && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ token, data: { type, task } }));
    }
  }

  getTasks(): Observable<ITask[]> {
    return this.manager.http.get<ITask[]>(this.baseUrl);
  }

  addTask(task: ITask): Observable<ITask> {
    return new Observable((observer) => {
      this.manager.http.post<ITask>(this.baseUrl, task).subscribe((newTask) => {
        this.sendWebSocketUpdate(tasksEvents.added, newTask);
        observer.next(newTask);
        observer.complete();
      });
    });
  }

  updateTask(task: ITask, istoggle?: boolean): Observable<ITask> {
    const type = istoggle ? tasksEvents.statusChanged : tasksEvents.edited;

    return this.manager.http.put<ITask>(`${this.baseUrl}/${task._id}`, task).pipe(
      tap((updatedTask) => this.sendWebSocketUpdate(type, updatedTask))
    );
  }

  toggleStatus(task: ITask): Observable<void> {
    return new Observable((observer) => {
      this.manager.http.put<void>(`${this.baseUrl}/${task._id}`, task).subscribe(() => {
        this.sendWebSocketUpdate(tasksEvents.statusChanged, task);
        observer.next();
        observer.complete();
      });
    });
  }

  deleteTask(task: ITask): Observable<void> {
    return new Observable((observer) => {
      this.manager.http.delete<void>(`${this.baseUrl}/${task._id}`).subscribe(() => {
        this.sendWebSocketUpdate(tasksEvents.deleted, task);
        observer.next();
        observer.complete();
      });
    });
  }
}
