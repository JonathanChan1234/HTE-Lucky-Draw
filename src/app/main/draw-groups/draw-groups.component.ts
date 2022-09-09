import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DrawMainAction } from '../draw-main.action';
import { DrawMainSelector } from '../draw-main.selector';

@Component({
    selector: 'app-draw-groups',
    templateUrl: './draw-groups.component.html',
    styleUrls: ['./draw-groups.component.scss'],
})
export class DrawGroupsComponent implements OnInit, OnDestroy {
    loading$!: Observable<boolean>;
    error$!: Observable<string | undefined>;

    items$!: Observable<{ text: string; state: 'reset' | 'in' | 'out' }[]>;
    state: ('reset' | 'in' | 'out')[] = ['in', 'out'];

    constructor(private readonly store: Store) {}

    ngOnInit(): void {
        this.items$ = this.store.select(DrawMainSelector.selectAnimateItems);
        // this.itemShown$ = drawGroups$.pipe(
        //     tap(() =>
        //         this.store.dispatch(
        //             DrawMainAction.setAnimating({ animating: true })
        //         )
        //     ),
        //     concatMap((groups) =>
        //         interval(100).pipe(
        //             take(20),
        //             map((x) =>
        //                 groups.map((group) =>
        //                     x !== 19
        //                         ? {
        //                               text: group.candidates[
        //                                   x % group.candidates.length
        //                               ].name,
        //                               state: this.state[x % this.state.length],
        //                           }
        //                         : {
        //                               text: group.winner.name,
        //                               state: 'reset' as 'reset' | 'in' | 'out',
        //                           }
        //                 )
        //             )
        //         )
        //     ),
        //     finalize(() =>
        //         this.store.dispatch(
        //             DrawMainAction.setAnimating({ animating: false })
        //         )
        //     )
        // );

        this.loading$ = this.store.select(
            DrawMainSelector.selectLoadingDrawGroups
        );
        this.error$ = this.store.select(
            DrawMainSelector.selectLoadDrawGroupError
        );
    }

    ngOnDestroy(): void {
        this.store.dispatch(DrawMainAction.clearDrawGroups());
    }
}
