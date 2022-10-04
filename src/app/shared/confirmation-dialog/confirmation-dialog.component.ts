import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmationDialogData {
    title: string;
    content: string;
}

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
        private matDialogRef: MatDialogRef<ConfirmationDialogComponent>
    ) {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ngOnInit(): void {}

    confirm(): void {
        this.matDialogRef.close(true);
    }
}
