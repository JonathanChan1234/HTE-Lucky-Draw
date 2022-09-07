import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DrawMainRoutingModule } from './draw-main-routing-modue';
import { DrawMainComponent } from './draw-main/draw-main.component';
import { DrawAnimationBlockComponent } from './draw-animation-block/draw-animation-block.component';

@NgModule({
    declarations: [DrawMainComponent, DrawAnimationBlockComponent],
    imports: [CommonModule, DrawMainRoutingModule, MatButtonModule],
})
export class DrawMainModule {}
