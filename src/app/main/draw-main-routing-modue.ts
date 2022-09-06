import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawMainComponent } from './draw-main/draw-main.component';

const routes: Routes = [{ path: '', component: DrawMainComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DrawMainRoutingModule {}
