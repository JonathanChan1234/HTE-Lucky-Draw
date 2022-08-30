import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ScreenSizeService } from 'src/app/service/screen-size/screen-size.service';
import { Prize } from '../prize';
import { PrizeSelector } from '../prize.selector';
import { PrizeService } from '../prize.service';

@Component({
    selector: 'app-prize-list',
    templateUrl: './prize-list.component.html',
    styleUrls: ['./prize-list.component.scss'],
})
export class PrizeListComponent implements OnInit {
    drawId!: string | null;
    isSmallScreen$!: Observable<boolean>;
    loading$!: Observable<boolean>;
    prizes$!: Observable<Prize[]>;
    error$!: Observable<string | null>;

    constructor(
        private screenSizeService: ScreenSizeService,
        private prizeService: PrizeService,
        private readonly store: Store
    ) {}

    ngOnInit(): void {
        this.isSmallScreen$ = this.screenSizeService.isSmallScreen();
        this.loading$ = this.store.select(PrizeSelector.selectLoading);
        this.prizes$ = this.store.select(PrizeSelector.selectPrizeList);
        this.error$ = this.store.select(PrizeSelector.selectError);
    }
}
