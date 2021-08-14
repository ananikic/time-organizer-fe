import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-delete-buttton',
  templateUrl: './delete-buttton.component.html',
  styleUrls: ['./delete-buttton.component.scss']
})
export class DeleteButttonComponent implements OnInit {

  canDelete: boolean = false;
  @Output() delete = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  deleteSomething() {
    this.delete.emit(true);
    this.canDelete = false;
  }

  prepareForDelete() {
    this.canDelete = true;
  }

  cancel() {
    this.canDelete = false;
  }

}
