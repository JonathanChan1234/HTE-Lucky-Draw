import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { first, Subscription } from 'rxjs';
import { PrizeAction } from '../prize.action';
import { PrizeSelector } from '../prize.selector';

interface PrizeFilterForm {
    searchValue: FormControl<string>;
    assigned: FormControl<'all' | 'assigned' | 'notAssigned'>;
}

@Component({
    selector: 'app-prize-search-bar',
    templateUrl: './prize-search-bar.component.html',
    styleUrls: ['./prize-search-bar.component.scss'],
})
export class PrizeSearchBarComponent implements OnInit, OnDestroy {
    formGroup: FormGroup<PrizeFilterForm>;
    subscription!: Subscription;

    constructor(private readonly store: Store) {
        this.formGroup = new FormGroup({
            searchValue: new FormControl<string>('', {
                nonNullable: true,
            }),
            assigned: new FormControl<'all' | 'assigned' | 'notAssigned'>(
                'all',
                {
                    nonNullable: true,
                }
            ),
        });
    }

    ngOnInit(): void {
        this.subscription = this.store
            .select(PrizeSelector.selectFilter)
            .pipe(first())
            .subscribe((filter) => {
                this.formGroup.setValue({
                    searchValue: filter.searchValue ?? '',
                    assigned:
                        filter.assigned === undefined
                            ? 'all'
                            : filter.assigned
                            ? 'assigned'
                            : 'notAssigned',
                });
            });
    }

    updatePrizeFilter() {
        if (!this.formGroup) return;
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

    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
