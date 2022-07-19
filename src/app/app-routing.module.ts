import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LuckyDrawComponent } from './pages/lucky-draw/lucky-draw.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
    { path: '', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'main', component: LuckyDrawComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
