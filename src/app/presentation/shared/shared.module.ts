import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper'
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

const modules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatDialogModule,
  LayoutModule,
  MatIconModule,
  MatButtonModule,
  MatSelectModule,
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatTabsModule,
  MatStepperModule,
  NgbTimepickerModule
];

@NgModule({
  declarations: [],
  imports: [
    ...modules
  ],
  exports: [...modules],
})
export class SharedModule { }
