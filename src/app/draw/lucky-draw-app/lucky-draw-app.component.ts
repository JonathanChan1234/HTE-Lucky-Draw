import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { Draw } from '../draw';
import { DrawAction } from '../draw.action';
import { DrawSelector } from '../draw.selector';

@Component({
    selector: 'app-lucky-draw-app',
    templateUrl: './lucky-draw-app.component.html',
    styleUrls: ['./lucky-draw-app.component.scss'],
})
export class LuckyDrawAppComponent implements OnInit {
    user$!: Subject<User | null>;
    draw$!: Observable<Draw | undefined>;
    loading$!: Observable<boolean>;
    error$!: Observable<string | undefined>;

    constructor(private route: ActivatedRoute, private readonly store: Store) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            if (!params['drawId']) return;
            this.store.dispatch(
                DrawAction.loadCurrentDraw({ drawId: params['drawId'] })
            );
        });
        this.draw$ = this.store.select(DrawSelector.selectCurrentDraw);
        this.loading$ = this.store.select(
            DrawSelector.selectLoadingCurrentDraw
        );
        this.error$ = this.store.select(
            DrawSelector.selectLoadCurrentDrawError
        );
    }
}
