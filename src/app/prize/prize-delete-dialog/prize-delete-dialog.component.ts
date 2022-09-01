import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Prize } from '../prize';

@Component({
    selector: 'app-prize-delete-dialog',
    templateUrl: './prize-delete-dialog.component.html',
    styleUrls: ['./prize-delete-dialog.component.scss'],
})
export class PrizeDeleteDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public prize: Prize,
        private matDialogRef: MatDialogRef<PrizeDeleteDialogComponent>
    ) {}

    deletePrize() {
        this.matDialogRef.close(true);
    }
}
