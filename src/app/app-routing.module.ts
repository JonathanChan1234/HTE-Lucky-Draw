import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawSettingComponent } from './draw/draw-setting/draw-setting.component';
import { LuckyDrawAppComponent } from './draw/lucky-draw-app/lucky-draw-app.component';
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
        component: LuckyDrawComponent,
        canActivate: [FirebaseAuthPrivateGuard],
    },
    {
        path: 'draws/:drawId',
        component: LuckyDrawAppComponent,
        children: [
            {
                path: 'settings',
                component: DrawSettingComponent,
            },
            {
                path: 'main',
                loadChildren: () =>
                    import('./main/draw-main.module').then(
                        (m) => m.DrawMainModule
                    ),
            },
            {
                path: 'participants',
                loadChildren: () =>
                    import('./participant/participant.module').then(
                        (m) => m.ParticipantModule
                    ),
            },
            {
                path: 'prizes',
                loadChildren: () =>
                    import('./prize/prize.module').then((m) => m.PrizeModule),
            },
            { path: '**', redirectTo: 'main' },
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
    imports: [
        RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
