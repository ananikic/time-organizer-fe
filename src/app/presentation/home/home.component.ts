import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OktaAuthService } from '@okta/okta-angular';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { addMinutes, formatISO } from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import { COLOR } from 'src/app/abstraction/activities/constants/activity.constants';
import { ActivityInstance, ActivityInstanceBinding } from 'src/app/abstraction/activities/models/activityInstance.model';
import { User } from 'src/app/abstraction/activities/models/user.model';
import { AuthService } from 'src/app/core/auth/auth.service';
import { WeekViewHourSegment } from 'calendar-utils';
import { PlanApiService } from 'src/app/core/plan/services/plan-api.service';
import { ActivityInstanceDialogComponent } from '../plan/activity-instance-dialog/activity-instance-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isAuthenticated: boolean = false;
  user!: User;

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Day;
  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();
  activityInstances!: ActivityInstance[];
  activityInstancesSub!: Subscription;


  constructor(public oktaAuth: OktaAuthService, private auth: AuthService,
    public apiPlan: PlanApiService, private cdr: ChangeDetectorRef, public dialog: MatDialog) {
  }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    if (!this.isAuthenticated) {
      this.oktaAuth.signInWithRedirect();
    }

    if (!this.auth.user) {
      await this.auth.findUser();
    }

    this.auth.user$.subscribe((userRes) => {
      this.user = userRes;
      this.activityInstancesSub = this.apiPlan.getActivityInstances(this.user.id!).subscribe((res) => {
        this.activityInstances = res;
        this.initEvents();
      });
    });

    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean)  => this.isAuthenticated = isAuthenticated
    );
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

  private refreshView(): void {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

  onClick(event: CalendarEvent, create?: boolean): void {
    if (!create) {
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
            userId: this.user.id!,
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
    } else {
      const activityInstance: ActivityInstance = {
        title: event.title,
        start: formatISO(event.start).slice(0, -6),
        end:  formatISO(addMinutes(event.start, 30)).slice(0, -6),
        color: COLOR.CANARY
      };
      const dialogRef = this.dialog.open(ActivityInstanceDialogComponent, {
        width: '360px',
        data: { activityInstance, create: true },
        restoreFocus: false
      });

      dialogRef.afterClosed().subscribe((data: { activityInstance: ActivityInstance; delete: boolean }) => {
        if (data?.activityInstance) {
          const activityInstanceBinding: ActivityInstanceBinding = {
            title: data.activityInstance.title,
            start: data.activityInstance.start,
            end: data.activityInstance.end,
            userId: this.user.id!,
            secondaryColor: data.activityInstance.color!.secondaryColor
          };

          this.apiPlan.createActivityInstance(activityInstanceBinding).subscribe((activityInstance) => {
            this.activityInstances.push(activityInstance);
            event.id = activityInstance.id;
            event.start = new Date(activityInstance.start);
            event.end = new Date(activityInstance.end!);
            event.title = activityInstance.title;
            event.color =  { primary: activityInstance.color?.primaryColor || '', secondary: activityInstance.color?.secondaryColor || '' };
            event.cssClass = activityInstance.color?.isLight ? 'light' : 'dark';
            event.resizable = {
              beforeStart: true,
              afterEnd: true,
            };
            event.draggable = true;
            this.refreshView();
          });
        } else {
          this.events = this.events.filter((e) => e.id !== event.id);
        }
      });
    }
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
        userId: this.user.id!,
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

    this.events = [...this.events, dragToSelectEvent];
    this.onClick(dragToSelectEvent, true);
  }

}
