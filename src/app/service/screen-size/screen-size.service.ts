import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, OnDestroy } from '@angular/core';
import {
    BehaviorSubject,
    map,
    Observable,
    Subject,
    Subscription,
    takeUntil,
} from 'rxjs';
import {
    ScreenSize,
    SCREENSIZE_LARGE,
    SCREENSIZE_MEDIUM,
    SCREENSIZE_SMALL,
    SCREENSIZE_UNKNOWN,
    SCREENSIZE_XLARGE,
    SCREENSIZE_XSMALL,
} from 'src/app/constants/screenSize';

@Injectable({
    providedIn: 'root',
})
export class ScreenSizeService implements OnDestroy {
    destroyed = new Subject<void>();
    screenSizeSubscription: Subscription;
    private screenSize$ = new BehaviorSubject<ScreenSize>(SCREENSIZE_MEDIUM);

    displayNameMap = new Map<string, ScreenSize>([
        [Breakpoints.XSmall, SCREENSIZE_XSMALL],
        [Breakpoints.Small, SCREENSIZE_SMALL],
        [Breakpoints.Medium, SCREENSIZE_MEDIUM],
        [Breakpoints.Large, SCREENSIZE_LARGE],
        [Breakpoints.XLarge, SCREENSIZE_XLARGE],
    ]);

    constructor(breakpointObserver: BreakpointObserver) {
        this.screenSizeSubscription = breakpointObserver
            .observe([
                Breakpoints.XSmall,
                Breakpoints.Small,
                Breakpoints.Medium,
                Breakpoints.Large,
                Breakpoints.XLarge,
            ])
            .pipe(takeUntil(this.destroyed))
            .subscribe((result) => {
                for (const query of Object.keys(result.breakpoints)) {
                    if (result.breakpoints[query]) {
                        const currentScreenSize: ScreenSize =
                            this.displayNameMap.get(query) ??
                            SCREENSIZE_UNKNOWN;
                        this.screenSize$.next(currentScreenSize);
                    }
                }
            });
    }

    getCurrentScreenSize(): BehaviorSubject<ScreenSize> {
        return this.screenSize$;
    }

    isSmallScreen(): Observable<boolean> {
        return this.screenSize$.pipe(
            map(
                (size) =>
                    size === SCREENSIZE_SMALL || size === SCREENSIZE_XSMALL
            )
        );
    }

    ngOnDestroy(): void {
        this.destroyed.next();
        this.destroyed.complete();
        this.screenSizeSubscription.unsubscribe();
    }
}
