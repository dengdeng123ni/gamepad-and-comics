import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { SelectTimeService } from './select-time.service';

@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrl: './select-time.component.scss'
})
export class SelectTimeComponent {


  dateRange = {
    start: {
      YYYY: 2024,
      MM: 12,
      DD: 12,
      date: null
    },
    end: {
      YYYY: 2024,
      MM: 12,
      DD: 12
    },
  };

  max_start_DD = 0;
  max_end_DD = 0;

  name=""

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data,
    public SelectTimeRange: SelectTimeService
  ) {
    if (data) {
      this.name=data.name;
      data=data.data;
      if (data) {
        this.setEndTime(data)
      } else {
        this.setEndTime(new Date().getTime())
      }
    }
  }

  setStartTime(date) {
    const now = new Date(date);
    this.dateRange.start.YYYY = now.getFullYear();
    this.dateRange.start.MM = now.getMonth() + 1;
    this.dateRange.start.DD = now.getDate();
    this.dateRange.start.date = now;
    this.max_start_DD = this.getDaysInMonth(this.dateRange.start.YYYY, this.dateRange.start.MM - 1)
  }

  setEndTime(date) {
    const now = new Date(date);
    this.dateRange.end.YYYY = now.getFullYear();
    this.dateRange.end.MM = now.getMonth() + 1;
    this.dateRange.end.DD = now.getDate();
    this.dateRange.start.date = now;
    this.max_end_DD = this.getDaysInMonth(this.dateRange.start.YYYY, this.dateRange.start.MM - 1)
  }

  start_MM_add() {
    this.dateRange.start.MM = this.dateRange.start.MM + 1;
    this.max_start_DD = this.getDaysInMonth(this.dateRange.start.YYYY, this.dateRange.start.MM - 1)
    if (this.dateRange.start.DD > this.max_start_DD) {
      this.dateRange.start.DD = this.max_start_DD;
    }
  }

  start_MM_reduce() {
    this.dateRange.start.MM = this.dateRange.start.MM - 1;

    this.getDaysInMonth(this.dateRange.start.YYYY, this.dateRange.start.MM);
    this.max_start_DD = this.getDaysInMonth(this.dateRange.start.YYYY, this.dateRange.start.MM - 1)
    if (this.dateRange.start.DD > this.max_start_DD) {
      this.dateRange.start.DD = this.max_start_DD;
    }
  }

  start_YYYY_add() {
    this.dateRange.start.YYYY = this.dateRange.start.YYYY + 1;
    this.getDaysInMonth(this.dateRange.start.YYYY, this.dateRange.start.MM);
    this.max_start_DD = this.getDaysInMonth(this.dateRange.start.YYYY, this.dateRange.start.MM - 1)
    if (this.dateRange.start.DD > this.max_start_DD) {
      this.dateRange.start.DD = this.max_start_DD;
    }
  }

  start_YYYY_reduce() {
    this.dateRange.start.YYYY = this.dateRange.start.YYYY - 1;
    this.getDaysInMonth(this.dateRange.start.YYYY, this.dateRange.start.MM);
    this.max_start_DD = this.getDaysInMonth(this.dateRange.start.YYYY, this.dateRange.start.MM - 1)
    if (this.dateRange.start.DD > this.max_start_DD) {
      this.dateRange.start.DD = this.max_start_DD;
    }
  }

  getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }



  end_MM_add() {
    this.dateRange.end.MM = this.dateRange.end.MM + 1;
    this.max_end_DD = this.getDaysInMonth(this.dateRange.end.YYYY, this.dateRange.end.MM - 1)
    if (this.dateRange.end.DD > this.max_end_DD) {
      this.dateRange.end.DD = this.max_end_DD;
    }
  }

  end_MM_reduce() {
    this.dateRange.end.MM = this.dateRange.end.MM - 1;

    this.getDaysInMonth(this.dateRange.end.YYYY, this.dateRange.end.MM);
    this.max_end_DD = this.getDaysInMonth(this.dateRange.end.YYYY, this.dateRange.end.MM - 1)
    if (this.dateRange.end.DD > this.max_end_DD) {
      this.dateRange.end.DD = this.max_end_DD;
    }
  }

  end_YYYY_add() {
    this.dateRange.end.YYYY = this.dateRange.end.YYYY + 1;
    this.getDaysInMonth(this.dateRange.end.YYYY, this.dateRange.end.MM);
    this.max_end_DD = this.getDaysInMonth(this.dateRange.end.YYYY, this.dateRange.end.MM - 1)
    if (this.dateRange.end.DD > this.max_end_DD) {
      this.dateRange.end.DD = this.max_end_DD;
    }
  }

  end_YYYY_reduce() {
    this.dateRange.end.YYYY = this.dateRange.end.YYYY - 1;
    this.getDaysInMonth(this.dateRange.end.YYYY, this.dateRange.end.MM);
    this.max_end_DD = this.getDaysInMonth(this.dateRange.end.YYYY, this.dateRange.end.MM - 1)
    if (this.dateRange.end.DD > this.max_end_DD) {
      this.dateRange.end.DD = this.max_end_DD;
    }
  }



  close() {
    this.SelectTimeRange.close();
  }

  on() {

    this.SelectTimeRange.value =  new Date(`${this.dateRange.start.YYYY}-${this.dateRange.start.MM}-${this.dateRange.start.DD}`)
    this.SelectTimeRange.opened = false;
  }

  changeRangeTime(e) {
    this.setEndTime(new Date().getTime())
    if (e == 1) {

      this.setStartTime(new Date().getTime() - 86400000)
    }
    if (e == 2) {
      this.setStartTime(new Date().getTime() - 86400000 * 7)
    }

    if (e == 3) {
      this.setStartTime(new Date().getTime() - 86400000 * 30)
    }
    if (e == 4) {
      this.setStartTime(new Date().getTime() - 86400000 * 90)
    }
  }
}
