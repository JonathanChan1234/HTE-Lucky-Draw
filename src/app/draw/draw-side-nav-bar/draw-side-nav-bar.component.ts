import {
    animate,
    AnimationEvent,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-draw-side-nav-bar',
    templateUrl: './draw-side-nav-bar.component.html',
    styleUrls: ['./draw-side-nav-bar.component.scss'],
    animations: [
        trigger('collapseExpand', [
            state('expand', style({ width: '250px' })),
            state('collapse', style({ width: '100px' })),
            transition('expand => collapse', [animate(100)]),
            transition('collapse => expand', [animate(100)]),
        ]),
    ],
})
export class DrawSideNavBarComponent implements OnInit {
    expand = true;
    showBigNav = true;

    constructor(private router: Router, private route: ActivatedRoute) {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ngOnInit(): void {}

    navigateToHome(): Promise<boolean> {
        return this.router.navigate(['home']);
    }

    navigateToMain(): Promise<boolean> {
        return this.router.navigate(['main'], { relativeTo: this.route });
    }

    navigateToPrize(): Promise<boolean> {
        return this.router.navigate(['prizes'], { relativeTo: this.route });
    }

    navigateToParticipant(): Promise<boolean> {
        return this.router.navigate(['participants'], {
            relativeTo: this.route,
        });
    }

    navigateToSettings(event: Event): Promise<boolean> {
        event.stopPropagation();
        return this.router.navigate(['settings'], { relativeTo: this.route });
    }

    onAnimationDone(event: AnimationEvent) {
        if (event.fromState === 'expand' && event.toState === 'collapse')
            this.showBigNav = false;
        if (event.fromState === 'collapse' && event.toState === 'expand')
            this.showBigNav = true;
    }

    expandNavBar(): void {
        this.expand = true;
    }

    collapseNavBar(): void {
        this.expand = false;
    }
}
