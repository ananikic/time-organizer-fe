import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { COLOR, DAY, TIME } from 'src/app/abstraction/activities/constants/activity.constants';
import { Activity, ActivityColor } from 'src/app/abstraction/activities/models/activity.model';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-activity-dialog',
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.scss'],
})
export class ActivityDialogComponent implements OnInit {

  activityFormGroup!: FormGroup;
  duration = { hour: 1, minute: 0 };
  frequency = 1;
  days = Object.values(DAY);
  dayTimes = Object.values(TIME);
  showEmojis = false;
  colors = Object.values(COLOR);

  emojiPicker = {
    set: 'native',
    native: true,
    darkMode: false,
  }

  constructor(
    public dialogRef: MatDialogRef<ActivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { activity: Activity, update: boolean, delete: boolean, reopenDialog: boolean },
    private fb: FormBuilder,
    private themeService: ThemeService) { }

  ngOnInit() {
    const theme = this.themeService.currentActive();
    this.emojiPicker.darkMode = theme === 'dark';

    this.initData();
  }

  initData(): void {
    this.activityFormGroup = this.fb.group({
      activityFormArray: this.fb.array([
        this.fb.group({
          name: [this.data.update ? this.data.activity.name : '', Validators.required],
          icon: [this.data.update ? this.data.activity.icon : '🔎', Validators.required],
          color: [this.data.update ? this.data.activity.color : COLOR.CANARY, Validators.required],
        }),
        this.fb.group({
          duration: [this.data.update ? this.data.activity.duration : 60, Validators.required],
          frequency: [this.data.update ? this.data.activity.frequency : 1, Validators.required]
        }),
        this.fb.group({
          dayPreference:  [this.data.update ? this.data.activity.dayPreference : []],
          timePreference:  [this.data.update ? this.data.activity.timePreference : []],
          concreteTime: [this.data.update ? { hour: parseInt(this.data.activity.concreteTime?.split(":")[0] || ''), minute: parseInt(this.data.activity.concreteTime?.split(":")[1]  || '') } : {}],
        }),
      ])
    });

    if (this.data.update) {
      this.duration.hour = Math.floor(this.data.activity.duration / 60);
      this.duration.minute = this.data.activity.duration % 60;
      this.frequency = this.data.activity.frequency;
    }
  }

  onCreate(reopenDialog: boolean): void {
    this.activityFormArray?.get([1])?.setValue({
      duration: this.duration.hour * 60 + this.duration.minute,
      frequency: this.frequency,
    });

    const formData = this.activityFormArray?.value;
    this.data = {
      activity: {
        name: formData[0].name,
        icon: formData[0].icon,
        color: formData[0].color,
        duration: formData[1].duration,
        frequency: formData[1].frequency,
        dayPreference: formData[2].dayPreference,
        timePreference: formData[2].timePreference,
        concreteTime: formData[2].concreteTime.hour + ":" + formData[2].concreteTime.minute,
      },
      update: false,
      delete: false,
      reopenDialog
    };

    if (!this.data.activity.timePreference?.includes(TIME.CONCRETE.name)) {
      this.data.activity.concreteTime = undefined;
    }

    this.dialogRef.close(this.data);
  }

  onUpdate(deleteActivity: boolean): void {
    this.activityFormArray?.get([1])?.setValue({
      duration: this.duration.hour * 60 + this.duration.minute,
      frequency: this.frequency,
    });

    const formData = this.activityFormArray?.value;
    this.data = {
      activity: {
        id: this.data.activity.id,
        name: formData[0].name,
        icon: formData[0].icon,
        color: formData[0].color,
        duration: formData[1].duration,
        frequency: formData[1].frequency,
        dayPreference: formData[2].dayPreference,
        timePreference: formData[2].timePreference,
        concreteTime: formData[2].concreteTime.hour + ":" + formData[2].concreteTime.minute,
      },
      update: true,
      delete: deleteActivity,
      reopenDialog: false
    };

    if (!this.data.activity.timePreference?.includes(TIME.CONCRETE.name)) {
      this.data.activity.concreteTime = undefined;
    }

    this.dialogRef.close(this.data);
  }

  handleEmoji(event: EmojiEvent): void {
    this.activityFormArray?.get([0])?.patchValue({
      icon: event.emoji.native
    });
    this.showEmojis = false;
  }

  onSelect(color: ActivityColor): void {
    this.activityFormArray?.get([0])?.patchValue({
      color
    });
  }

  toggleEmojiPicker(): void {
    this.showEmojis = !this.showEmojis;
  }

  noDayPreference(): boolean {
    return !this.activityFormArray?.value[2].dayPreference?.length;
  }

  noTimePreference(): boolean {
    return !this.activityFormArray?.value[2].timePreference?.length;
  }

  concreteTimePreference(): boolean {
    return this.activityFormArray?.value[2].timePreference?.includes(TIME.CONCRETE.name);
  }

  get activityFormArray(): AbstractControl | null {
    return this.activityFormGroup.get('activityFormArray') || null;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
