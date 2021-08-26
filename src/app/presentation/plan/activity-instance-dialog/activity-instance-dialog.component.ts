import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { formatISO } from 'date-fns';
import { COLOR } from 'src/app/abstraction/activities/constants/activity.constants';
import { ActivityColor } from 'src/app/abstraction/activities/models/activity.model';
import { ActivityInstance } from 'src/app/abstraction/activities/models/activityInstance.model';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-activity-instance-dialog',
  templateUrl: './activity-instance-dialog.component.html',
  styleUrls: ['./activity-instance-dialog.component.scss']
})
export class ActivityInstanceDialogComponent implements OnInit {

  colors = Object.values(COLOR);
  startTime = { hour: 0, minute: 0 };
  endTime = { hour: 0, minute: 0 };

  emojiPicker = {
    set: 'native',
    native: true,
    darkMode: false,
  }
  showEmojis = false;

  constructor(public dialogRef: MatDialogRef<ActivityInstanceDialogComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: { activityInstance: ActivityInstance; delete: boolean; create?: boolean; },
              private themeService: ThemeService) { }

  ngOnInit(): void {
    const theme = this.themeService.currentActive();
    this.emojiPicker.darkMode = theme === 'dark';
    this.startTime = { hour: +this.data.activityInstance.start.split("T")[1].split(":")[0], minute: +this.data.activityInstance.start.split("T")[1].split(":")[1]};
    this.endTime = { hour: +this.data.activityInstance.end!.split("T")[1].split(":")[0], minute: +this.data.activityInstance.end!.split("T")[1].split(":")[1]};
  }

  onSelect(color: ActivityColor): void {
    this.data.activityInstance.color = color;
  }

  toggleEmojiPicker(): void {
    this.showEmojis = !this.showEmojis;
  }

  handleEmoji(event: EmojiEvent): void {
    if (this.data.activityInstance.title.match(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g)) {
      this.data.activityInstance.title = this.data.activityInstance.title
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, event.emoji.native || '');
    } else {
      this.data.activityInstance.title = event.emoji.native + this.data.activityInstance.title;
    }
    this.showEmojis = false;
  }

  onUpdate(deleteActivityInstance: boolean): void {
    if (deleteActivityInstance) {
      this.data.delete = true;
    } else {
      const startDate = new Date(this.data.activityInstance.start);
      const endDate = new Date(this.data.activityInstance.end!);
      startDate.setHours(this.startTime.hour);
      startDate.setMinutes(this.startTime.minute);
      endDate.setHours(this.endTime.hour);
      endDate.setMinutes(this.endTime.minute);
      this.data.activityInstance.start = formatISO(startDate).slice(0, -6);
      this.data.activityInstance.end = formatISO(endDate).slice(0, -6);
    }

    this.dialogRef.close(this.data);
  }

}
