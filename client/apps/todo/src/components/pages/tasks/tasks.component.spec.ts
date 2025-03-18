import { TestBed } from '@angular/core/testing';
import { TasksComponent } from './tasks.component';

describe('TasksComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksComponent],
    }).compileComponents();
  });

  it('should create the tasks page', () => {
    const fixture = TestBed.createComponent(TasksComponent);
    const tasks = fixture.componentInstance;
    expect(tasks).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(TasksComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, todo');
  });
});