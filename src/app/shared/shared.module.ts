import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmptyListComponent } from './empty-list/empty-list.component';
import { ErrorMessageBarComponent } from './error-message-bar/error-message-bar.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
    declarations: [
        ErrorMessageBarComponent,
        LoadingSpinnerComponent,
        EmptyListComponent,
    ],
    exports: [
        ErrorMessageBarComponent,
        LoadingSpinnerComponent,
        EmptyListComponent,
    ],
    imports: [CommonModule, MatProgressSpinnerModule],
})
export class SharedModule {}
