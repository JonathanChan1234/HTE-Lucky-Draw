import {
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
    concatMap,
    filter,
    finalize,
    interval,
    map,
    Observable,
    Subject,
    take,
    takeUntil,
    tap,
} from 'rxjs';
import {
    AnimateItem,
    AnimateItemState,
} from '../draw-animation-block/draw-animation-block.component';
import { DrawMainAction } from '../draw-main.action';
import { DrawGroup } from '../draw-main.reducer';
import { DrawMainSelector } from '../draw-main.selector';

const state: AnimateItemState[] = ['in', 'out'];

@Component({
    selector: 'app-draw-groups',
    templateUrl: './draw-groups.component.html',
    styleUrls: ['./draw-groups.component.scss'],
})
export class DrawGroupsComponent implements OnInit, OnDestroy {
    @Output()
    setAnimating = new EventEmitter<boolean>();

    drawGroups!: Observable<DrawGroup[]>;
    itemsShown$!: Observable<AnimateItem[]>;
    loading$!: Observable<boolean>;
    error$!: Observable<string | undefined>;

    animation = new Subject<boolean>();

    constructor(private readonly store: Store) {}

    ngOnInit(): void {
        this.loading$ = this.store.select(
            DrawMainSelector.selectLoadingDrawGroups
        );
        this.error$ = this.store.select(
            DrawMainSelector.selectLoadDrawGroupError
        );
        this.drawGroups = this.store.select(DrawMainSelector.selectDrawGroups);
        this.itemsShown$ = this.drawGroups.pipe(
            filter((groups) => groups.length !== 0),
            tap(() => this.setAnimating.emit(true)),
            concatMap((groups) =>
                interval(100).pipe(
                    take(20),
                    takeUntil(this.animation),
                    map((iteration) =>
                        groups.map(({ prize, candidates, winner }) => {
                            if (iteration < 19) {
                                const participant =
                                    candidates[iteration % candidates.length];
                                return {
                                    participant: `${participant.name} (ID: ${participant.id})`,
                                    state: state[iteration % state.length],
                                    prize: `${prize.sequence}. ${prize.name}`,
                                };
                            }
                            return {
                                participant: `${winner.name} (ID: ${winner.id})`,
                                state: 'reset' as AnimateItemState,
                                prize: `${prize.sequence}. ${prize.name}`,
                            };
                        })
                    ),
                    finalize(() => this.setAnimating.emit(false))
                )
            )
        );
    }

    ngOnDestroy(): void {
        this.setAnimating.emit(false);
        this.animation.next(false);
        this.animation.complete();
        this.store.dispatch(DrawMainAction.clearDrawGroups());
    }
}
