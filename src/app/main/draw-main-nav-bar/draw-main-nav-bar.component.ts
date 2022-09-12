import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Draw } from 'src/app/draw/draw';

@Component({
    selector: 'app-draw-main-nav-bar',
    templateUrl: './draw-main-nav-bar.component.html',
    styleUrls: ['./draw-main-nav-bar.component.scss'],
})
export class DrawMainNavBarComponent implements OnInit {
    @Input()
    draw!: Draw | null;

    constructor(private router: Router) {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ngOnInit(): void {}

    navigateToParticipantPage(): void {
        if (!this.draw) return;
        this.router.navigate([`/draws/${this.draw.id}/participants`]);
    }

    navigateToPrizePage(): void {
        if (!this.draw) return;
        this.router.navigate([`/draws/${this.draw.id}/prizes`]);
    }

    navigateToSettingPage(): void {
        if (!this.draw) return;
        this.router.navigate([`/draws/${this.draw.id}/settings`]);
    }
}
