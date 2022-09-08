import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { UtilsModule } from '../utils/utils.module';
import { DrawAnimationBlockComponent } from './draw-animation-block/draw-animation-block.component';
import { DrawMainNavBarComponent } from './draw-main-nav-bar/draw-main-nav-bar.component';
import { DrawMainRoutingModule } from './draw-main-routing-modue';
import { DrawMainEffect } from './draw-main.effect';
import { mainFeatureKey, mainReducer } from './draw-main.reducer';
import { DrawMainComponent } from './draw-main/draw-main.component';
import { PrizesSelectionDialogComponent } from './prizes-selection-dialog/prizes-selection-dialog.component';
import { PrizesSelectionComponent } from './prizes-selection/prizes-selection.component';
import { DrawGroupsComponent } from './draw-groups/draw-groups.component';

@NgModule({
    declarations: [
        DrawMainComponent,
        DrawAnimationBlockComponent,
        DrawMainNavBarComponent,
        PrizesSelectionComponent,
        PrizesSelectionDialogComponent,
        DrawGroupsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forFeature(mainFeatureKey, mainReducer),
        EffectsModule.forFeature([DrawMainEffect]),
        DrawMainRoutingModule,
        MatButtonModule,
        UtilsModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatDialogModule,
        MatCardModule,
    ],
})
export class DrawMainModule {}
