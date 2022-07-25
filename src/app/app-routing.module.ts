import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirebaseAuthPrivateGuard } from './guard/firebase-auth-private.guard';
import { AuthenticatingComponent } from './pages/authenticating/authenticating.component';
import { LoginComponent } from './pages/login/login.component';
import { LuckyDrawComponent } from './pages/lucky-draw/lucky-draw.component';
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
        path: 'authenticating',
        component: AuthenticatingComponent,
    },
    {
        path: 'main',
        children: [{ path: '', component: LuckyDrawComponent }],
        canActivate: [FirebaseAuthPrivateGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
