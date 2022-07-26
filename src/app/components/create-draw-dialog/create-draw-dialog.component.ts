import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'create-draw-dialog',
    templateUrl: './create-draw-dialog.component.html',
})
export class CreateDrawDialogComponent {
    constructor(public dialogRef: MatDialogRef<CreateDrawDialogComponent>) {}

    cancel(): void {
        this.dialogRef.close();
    }
}
