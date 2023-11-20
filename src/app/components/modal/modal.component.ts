import { Component, inject, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatInputModule } from '@angular/material/input';
import axios from 'axios';

export interface Tags {
  name: string;
}
@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    MatNativeDateModule,
    MatFormFieldModule,
    MatChipsModule,
    MatInputModule
  ],
})

export class ModalComponent {
  @Output() rerender = new EventEmitter<void>();

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  title: string = '';
  dateRange: any = '';
  addOnBlur = true;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  tags: Tags[] = [];

  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push({ name: value });
    }
    event.chipInput!.clear();
  }

  remove(tags: Tags): void {
    const index = this.tags.indexOf(tags);
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.announcer.announce(`Removed ${tags}`);
    }
  }

  edit(tags: Tags, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.remove(tags);
      return;
    }
    const index = this.tags.indexOf(tags);
    if (index >= 0) {
      this.tags[index].name = value;
    }
  }

  onTitle(event: any) {
    this.title = event.target.value;
  }

  resetState(): void {
    this.title = '';
    this.tags = [];
    this.dateRange = [];
  }

  addTicket(rangeDate: any) {
    const startDate = rangeDate.start;
    const endDate = rangeDate.end;
    axios.post('http://localhost:5000/api/tickets/add', {
      title: this.title,
      tags: this.tags,
      startDate,
      endDate
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    this.rerender.emit();
    this.resetState();
    const closeModalButton: any = document.getElementById('close-modal-button');
    closeModalButton.click();
  }
}
