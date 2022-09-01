import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { UtilsModule } from '../utils/utils.module';
import { DrawPrizeComponent } from './draw-prize/draw-prize.component';
import { PrizeCreateDialogComponent } from './prize-create-dialog/prize-create-dialog.component';
import { PrizeListComponent } from './prize-list/prize-list.component';
import { PrizePaginatorComponent } from './prize-paginator/prize-paginator.component';
import { PrizeRoutingModule } from './prize-routing.module';
import { PrizeSearchBarComponent } from './prize-search-bar/prize-search-bar.component';
import { PrizeToolbarComponent } from './prize-toolbar/prize-toolbar.component';
import { PrizeEffects } from './prize.effect';
import { prizeFeatureKey, prizeReducer } from './prize.reducer';
import { PrizeDeleteDialogComponent } from './prize-delete-dialog/prize-delete-dialog.component';

@NgModule({
    declarations: [
        PrizeToolbarComponent,
        PrizeListComponent,
        DrawPrizeComponent,
        PrizePaginatorComponent,
        PrizeSearchBarComponent,
        PrizeCreateDialogComponent,
        PrizeDeleteDialogComponent,
    ],
    imports: [
        PrizeRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forFeature(prizeFeatureKey, prizeReducer),
        EffectsModule.forFeature([PrizeEffects]),
        UtilsModule,
        MatListModule,
        MatChipsModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
        MatButtonModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatSnackBarModule,
    ],
})
export class PrizeModule {}
