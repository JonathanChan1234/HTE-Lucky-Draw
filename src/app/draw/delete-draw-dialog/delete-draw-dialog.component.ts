import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LuckyDrawService } from 'src/app/service/lucky-draw.service';

export interface DeleteDrawDialogData {
    name: string;
    id: string;
}

@Component({
    selector: 'app-delete-draw-dialog',
    templateUrl: './delete-draw-dialog.component.html',
    styleUrls: ['./delete-draw-dialog.component.scss'],
})
export class DeleteDrawDialogComponent {
    errMsg = '';
    loading = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DeleteDrawDialogData,
        public dialogRef: MatDialogRef<DeleteDrawDialogComponent>,
        private luckyDrawService: LuckyDrawService
    ) {}

    deleteDraw(): void {
        if (!this.data.id) return;
        this.loading = true;
        this.errMsg = '';
        this.luckyDrawService.deleteDraw(this.data.id).subscribe({
            next: () => {
                this.loading = false;
                this.dialogRef.close(true);
            },
            error: (err) => {
                this.loading = false;
                this.errMsg = err.message;
            },
        });
    }
}
