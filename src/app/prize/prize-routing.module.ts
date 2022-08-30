import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawPrizeComponent } from './draw-prize/draw-prize.component';

const routes: Routes = [{ path: '', component: DrawPrizeComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PrizeRoutingModule {}
