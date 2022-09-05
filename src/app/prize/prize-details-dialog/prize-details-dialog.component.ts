import { Component, Inject } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { convertDateToDateString } from 'src/app/utility/date';
import { Prize } from '../prize';

@Component({
    selector: 'app-prize-details-dialog',
    templateUrl: './prize-details-dialog.component.html',
})
export class PrizeDetailsDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public prize: Prize) {}

    convertToHumanReadableDate(date: Timestamp): string {
        return convertDateToDateString(date.toDate());
    }
}
