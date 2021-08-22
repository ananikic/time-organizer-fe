import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ActivityInstance } from 'src/app/abstraction/activities/models/activityInstance.model';
import { PlanApiService } from 'src/app/core/plan/services/plan-api.service';
import { ActivityInstanceDialogComponent } from './activity-instance-dialog/activity-instance-dialog.component';
import { WeekViewHourSegment } from 'calendar-utils';
import { addDays, addMinutes, endOfWeek } from 'date-fns';

function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision;
}


@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
})
export class PlanComponent implements OnInit {

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;
  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();
  activityInstances!: ActivityInstance[];
  activityInstancesSub!: Subscription;

  dragToCreateActive = false;
  weekStartsOn: any = 1;

  constructor(public apiPlan: PlanApiService, public dialog: MatDialog, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.activityInstancesSub = this.apiPlan.getActivityInstances().subscribe((res) => {
      this.activityInstances = res;
      this.initEvents();
    });
  }

  initEvents(): void {
    this.activityInstances.forEach((activityInstance) => {
      this.events.push({
        id: activityInstance.id,
        start: activityInstance.start,
        end: activityInstance.end,
        title: activityInstance.title,
        color: { primary: activityInstance.color?.primary || '', secondary: activityInstance.color?.secondary || '' },
        cssClass: activityInstance.color?.isLight ? 'light' : 'dark',
        resizable: {
            beforeStart: true,
            afterEnd: true,
        },
        draggable: true,
      });
    });
  }

  onClick(event: CalendarEvent): void {
    const activityInstance: ActivityInstance | undefined = this.activityInstances
      .find((activityInstance) => activityInstance.id === event.id);
    const dialogRef = this.dialog.open(ActivityInstanceDialogComponent, {
      width: '360px',
      data: { activityInstance },
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data?.activity) {
        // TODO: Update Activity Instance
      }
    });
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });

    // TODO: Update activity instance start and end
  }

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: '🔎 new event',
      start: segment.date,
      meta: {
        tmpEvent: true,
      },
    };

    // TODO: Create Activity Instance

    this.events = [...this.events, dragToSelectEvent];

    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          this.refreshView();
        }),
        takeUntil(fromEvent(document, 'mouseup'))
      )
      .subscribe((mouseMoveEvent: any) => {
        const minutesDiff = ceilToNearest(
          mouseMoveEvent.clientY - segmentPosition.top,
          30
        );

        const daysDiff =
          floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        }
        this.refreshView();
      });
  }

  private refreshView(): void {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

}
