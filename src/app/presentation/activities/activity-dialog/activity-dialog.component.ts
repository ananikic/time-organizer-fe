import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { DAY, TIME } from 'src/app/abstraction/activities/constants/activity.constants';
import { Activity } from 'src/app/abstraction/activities/models/activity.model';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-activity-dialog',
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.scss'],
})
export class ActivityDialogComponent implements OnInit {

  activityFormGroup!: FormGroup;
  time = { hour: 1, minute: 0 };
  frequency = 1;
  days = Object.values(DAY);
  dayTimes = Object.values(TIME);
  showEmojis = false;

  emojiPicker = {
    set: 'native',
    native: true,
    darkMode: false,
  }

  constructor(
    public dialogRef: MatDialogRef<ActivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { activity: Activity, update: boolean, reopenDialog: boolean },
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
        }),
        this.fb.group({
          duration: [this.data.update ? this.data.activity.duration : 60, Validators.required],
          frequency: [this.data.update ? this.data.activity.frequency : 1, Validators.required]
        }),
        this.fb.group({
          dayPreference:  [this.data.update ? this.data.activity.dayPreference : []],
          timePreference:  [this.data.update ? this.data.activity.timePreference : []],
        }),
      ])
    });

    if (this.data.update) {
      this.time.hour = Math.floor(this.data.activity.duration / 60);
      this.time.minute = this.data.activity.duration % 60;
      this.frequency = this.data.activity.frequency;
    }
  }

  onCreate(reopenDialog: boolean): void {
    this.activityFormArray?.get([1])?.setValue({
      duration: this.time.hour * 60 + this.time.minute,
      frequency: this.frequency,
    });

    const formData = this.activityFormArray?.value;
    this.data = {
      activity: {
        name: formData[0].name,
        icon: formData[0].icon,
        duration: formData[1].duration,
        frequency: formData[1].frequency,
        dayPreference: formData[2].dayPreference,
        timePreference: formData[2].timePreference,
      },
      update: false,
      reopenDialog
    };

    this.dialogRef.close(this.data);
  }

  onUpdate(): void {
    this.activityFormArray?.get([1])?.setValue({
      duration: this.time.hour * 60 + this.time.minute,
      frequency: this.frequency,
    });

    const formData = this.activityFormArray?.value;
    this.data = {
      activity: {
        name: formData[0].name,
        icon: formData[0].icon,
        duration: formData[1].duration,
        frequency: formData[1].frequency,
        dayPreference: formData[2].dayPreference,
        timePreference: formData[2].timePreference,
      },
      update: true,
      reopenDialog: false
    };

    this.dialogRef.close(this.data);
  }

  onDelete(): void {
    // TODO: Delete Activity
  }

  handleEmoji(event: EmojiEvent): void {
    this.activityFormArray?.get([0])?.patchValue({
      icon: event.emoji.native
    });
    this.showEmojis = false;
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

  get activityFormArray(): AbstractControl | null {
    return this.activityFormGroup.get('activityFormArray') || null;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
