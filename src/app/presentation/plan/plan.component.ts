import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { Subject, Subscription } from 'rxjs';
import { ActivityInstance } from 'src/app/abstraction/activities/models/activityInstance.model';
import { PlanApiService } from 'src/app/core/plan/services/plan-api.service';


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

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  constructor(public apiPlan: PlanApiService) { }

  ngOnInit(): void {
    this.activityInstancesSub = this.apiPlan.getActivityInstances().subscribe((res) => {
      this.activityInstances = res;
      this.initEvents();
    });
  }

  initEvents(): void {
    this.activityInstances.forEach((activityInstance) => {
      this.events.push({
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
        actions: this.actions
      });
    });
  }

  handleEvent(action: string, event: CalendarEvent): void {
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    console.log(newStart)
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
  }

}
