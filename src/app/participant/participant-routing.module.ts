import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawParticipantsComponent } from './draw-participants/draw-participants.component';

const routes: Routes = [{ path: '', component: DrawParticipantsComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ParticipantRoutingModule {}
