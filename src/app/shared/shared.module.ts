import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { EmptyListComponent } from './empty-list/empty-list.component';
import { ErrorMessageBarComponent } from './error-message-bar/error-message-bar.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
    declarations: [
        ErrorMessageBarComponent,
        LoadingSpinnerComponent,
        EmptyListComponent,
        ConfirmationDialogComponent,
    ],
    exports: [
        ErrorMessageBarComponent,
        LoadingSpinnerComponent,
        EmptyListComponent,
        ConfirmationDialogComponent,
    ],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatDialogModule,
    ],
})
export class SharedModule {}
