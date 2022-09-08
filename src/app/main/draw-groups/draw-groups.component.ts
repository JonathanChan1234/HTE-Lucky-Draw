import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DrawGroup } from '../draw-main.reducer';
import { DrawMainSelector } from '../draw-main.selector';

@Component({
    selector: 'app-draw-groups',
    templateUrl: './draw-groups.component.html',
    styleUrls: ['./draw-groups.component.scss'],
})
export class DrawGroupsComponent implements OnInit {
    drawGroups$!: Observable<DrawGroup[]>;
    loading$!: Observable<boolean>;
    error$!: Observable<string | undefined>;

    constructor(private readonly store: Store) {}

    ngOnInit(): void {
        this.drawGroups$ = this.store.select(DrawMainSelector.selectDrawGroups);
        this.loading$ = this.store.select(
            DrawMainSelector.selectLoadingDrawGroups
        );
        this.error$ = this.store.select(
            DrawMainSelector.selectLoadDrawGroupError
        );
    }
}
