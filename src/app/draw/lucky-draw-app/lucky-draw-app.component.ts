import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DrawAction } from '../draw.action';

@Component({
    selector: 'app-lucky-draw-app',
    templateUrl: './lucky-draw-app.component.html',
    styleUrls: ['./lucky-draw-app.component.scss'],
})
export class LuckyDrawAppComponent implements OnInit {
    constructor(private route: ActivatedRoute, private readonly store: Store) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            if (!params['drawId']) return;
            this.store.dispatch(
                DrawAction.setSelectedDraw({ drawId: params['drawId'] })
            );
        });
    }
}
