import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { Subject, Subscription } from 'rxjs';
import { ActivityInstance, ActivityInstanceBinding } from 'src/app/abstraction/activities/models/activityInstance.model';
import { PlanApiService } from 'src/app/core/plan/services/plan-api.service';
import { ActivityInstanceDialogComponent } from './activity-instance-dialog/activity-instance-dialog.component';
import { WeekViewHourSegment } from 'calendar-utils';
import { addMinutes, formatISO } from 'date-fns';
import { COLOR } from 'src/app/abstraction/activities/constants/activity.constants';

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

  weekStartsOn: any = 1;

  userId = 1;

  constructor(public apiPlan: PlanApiService, public dialog: MatDialog, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.activityInstancesSub = this.apiPlan.getActivityInstances(this.userId).subscribe((res) => {
      this.activityInstances = res;
      this.initEvents();
    });
  }

  initEvents(): void {
    this.activityInstances.forEach((activityInstance) => {
      this.events.push({
        id: activityInstance.id,
        start: new Date(activityInstance.start),
        end: new Date(activityInstance.end!),
        title: activityInstance.title,
        color: { primary: activityInstance.color?.primaryColor || '', secondary: activityInstance.color?.secondaryColor || '' },
        cssClass: activityInstance.color?.isLight ? 'light' : 'dark',
        resizable: {
            beforeStart: true,
            afterEnd: true,
        },
        draggable: true,
      });
    });
    this.refreshView();
  }

  onClick(event: CalendarEvent): void {
    const activityInstance: ActivityInstance | undefined = this.activityInstances
      .find((activityInstance) => activityInstance.id === event.id);
    const dialogRef = this.dialog.open(ActivityInstanceDialogComponent, {
      width: '360px',
      data: { activityInstance },
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe((data: { activityInstance: ActivityInstance; delete: boolean }) => {
      if (data?.delete) {
        this.apiPlan.deleteActivityInstance(data.activityInstance.id!).subscribe(() => {
          this.activityInstances = this.activityInstances.filter((a) => a.id !== data.activityInstance.id);
          this.events = this.events.filter((e) => e.id !== data.activityInstance.id);
        });
      } else if (data?.activityInstance) {
        const activityInstanceBinding: ActivityInstanceBinding = {
          id: data.activityInstance.id,
          title: data.activityInstance.title,
          start: data.activityInstance.start,
          end: data.activityInstance.end,
          userId: this.userId,
          secondaryColor: data.activityInstance.color!.secondaryColor
        };

        this.apiPlan.updateActivityInstance(activityInstanceBinding).subscribe((updatedActivityInstance: ActivityInstance) => {
          this.activityInstances = this.activityInstances.map((a) => a.id !== updatedActivityInstance.id ? a : updatedActivityInstance);
          const updatedEvent: CalendarEvent = {
            id: updatedActivityInstance.id,
            start: new Date(updatedActivityInstance.start),
            end: new Date(updatedActivityInstance.end!),
            title: updatedActivityInstance.title,
            color: { primary: updatedActivityInstance.color?.primaryColor || '', secondary: updatedActivityInstance.color?.secondaryColor || '' },
            cssClass: updatedActivityInstance.color?.isLight ? 'light' : 'dark',
            resizable: {
                beforeStart: true,
                afterEnd: true,
            },
            draggable: true,
          };
          this.events = this.events.map((e) => e.id !== updatedActivityInstance.id ? e : updatedEvent);
        });
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

    const activityInstance: ActivityInstance | undefined = this.activityInstances
      .find((activityInstance) => activityInstance.id === event.id);

    if (activityInstance) {
      const activityInstanceBinding: ActivityInstanceBinding = {
        id: activityInstance.id,
        title: activityInstance.title,
        start: formatISO(newStart).slice(0, -6),
        end: formatISO(newEnd!).slice(0, -6),
        userId: this.userId,
        secondaryColor: activityInstance.color!.secondaryColor
      };
      this.apiPlan.updateActivityInstance(activityInstanceBinding).subscribe((updatedActivityInstance: ActivityInstance) => {
        this.activityInstances = this.activityInstances.map((a) => a.id !== updatedActivityInstance.id ? a : updatedActivityInstance);
        const updatedEvent: CalendarEvent = {
          id: updatedActivityInstance.id,
          start: new Date(updatedActivityInstance.start),
          end: new Date(updatedActivityInstance.end!),
          title: updatedActivityInstance.title,
          color: { primary: updatedActivityInstance.color?.primaryColor || '', secondary: updatedActivityInstance.color?.secondaryColor || '' },
          cssClass: updatedActivityInstance.color?.isLight ? 'light' : 'dark',
          resizable: {
              beforeStart: true,
              afterEnd: true,
          },
          draggable: true,
        };
        this.events = this.events.map((e) => e.id !== updatedActivityInstance.id ? e : updatedEvent);
      });
    }
  }

  startDragToCreate(
    segment: WeekViewHourSegment
  ) {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: '🔎 new event',
      start: segment.date,
      color: { primary: COLOR.CANARY.primaryColor, secondary: COLOR.CANARY.secondaryColor },
      meta: {
        tmpEvent: true,
      },
    };

    const activityInstanceBinding: ActivityInstanceBinding = {
      title: dragToSelectEvent.title,
      start: formatISO(segment.date).slice(0, -6),
      end:  formatISO(addMinutes(dragToSelectEvent.start, 30)).slice(0, -6),
      userId: this.userId,
      secondaryColor: COLOR.CANARY.secondaryColor
    };

    this.apiPlan.createActivityInstance(activityInstanceBinding).subscribe((activityInstance) => {
      dragToSelectEvent.id = activityInstance.id;
      this.activityInstances.push(activityInstance);
      this.events = [...this.events, dragToSelectEvent];
      this.onClick(dragToSelectEvent);
    });

  }

  private refreshView(): void {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }
}
