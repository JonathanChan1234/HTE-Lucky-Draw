import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawSettingComponent } from './draw/draw-setting/draw-setting.component';
import { LuckyDrawComponent } from './draw/lucky-draw/lucky-draw.component';
import { FirebaseAuthPrivateGuard } from './guard/firebase-auth-private.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
        canActivate: [FirebaseAuthPrivateGuard],
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [FirebaseAuthPrivateGuard],
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [FirebaseAuthPrivateGuard],
    },
    {
        path: 'draws',
        children: [
            { path: '', component: LuckyDrawComponent },
            { path: ':drawId/settings', component: DrawSettingComponent },
            {
                path: ':drawId/main',
                loadChildren: () =>
                    import('./main/draw-main.module').then(
                        (m) => m.DrawMainModule
                    ),
            },
            {
                path: ':drawId/participants',
                loadChildren: () =>
                    import('./participant/participant.module').then(
                        (m) => m.ParticipantModule
                    ),
            },
            {
                path: ':drawId/prizes',
                loadChildren: () =>
                    import('./prize/prize.module').then((m) => m.PrizeModule),
            },
            { path: '**', redirectTo: '' },
        ],
        canActivate: [FirebaseAuthPrivateGuard],
    },
    {
        path: '**',
        component: LuckyDrawComponent,
        canActivate: [FirebaseAuthPrivateGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
