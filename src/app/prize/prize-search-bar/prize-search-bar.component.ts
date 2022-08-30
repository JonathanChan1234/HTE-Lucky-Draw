import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { PrizeAction } from '../prize.action';

interface PrizeFilterForm {
    searchValue: FormControl<string>;
    assigned: FormControl<'all' | 'assigned' | 'notAssigned'>;
}

@Component({
    selector: 'app-prize-search-bar',
    templateUrl: './prize-search-bar.component.html',
    styleUrls: ['./prize-search-bar.component.scss'],
})
export class PrizeSearchBarComponent implements OnInit {
    formGroup: FormGroup<PrizeFilterForm>;

    constructor(private readonly store: Store) {
        this.formGroup = new FormGroup({
            searchValue: new FormControl<string>('', { nonNullable: true }),
            assigned: new FormControl<'all' | 'assigned' | 'notAssigned'>(
                'all',
                { nonNullable: true }
            ),
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ngOnInit(): void {}

    updatePrizeFilter() {
        if (this.formGroup.invalid) return;
        const { searchValue, assigned } = this.formGroup.value;
        if (searchValue === undefined || assigned === undefined) return;
        this.store.dispatch(
            PrizeAction.setPrizeFilter({
                filter: {
                    searchValue,
                    assigned:
                        assigned === 'all'
                            ? undefined
                            : assigned === 'assigned',
                },
            })
        );
    }
}
