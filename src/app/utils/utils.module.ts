import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorMessageBarComponent } from './error-message-bar/error-message-bar.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
    declarations: [ErrorMessageBarComponent, LoadingSpinnerComponent],
    exports: [ErrorMessageBarComponent, LoadingSpinnerComponent],
    imports: [CommonModule, MatProgressSpinnerModule],
})
export class UtilsModule {}
