import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { ParticipantAction } from '../participant.action';
import { ParticipantSelector } from '../participant.selector';

interface ParticipantFilterForm {
    searchValue: FormControl<string>;
    searchField: FormControl<'id' | 'name'>;
    signIn: FormControl<'all' | 'signIn' | 'notSignIn'>;
    prizeWinner: FormControl<'all' | 'winner' | 'notWinner'>;
}

@Component({
    selector: 'app-participant-search-bar',
    templateUrl: './participant-search-bar.component.html',
    styleUrls: ['./participant-search-bar.component.scss'],
})
export class ParticipantSearchBarComponent implements OnInit {
    formGroup: FormGroup<ParticipantFilterForm>;

    constructor(private readonly store: Store) {
        this.formGroup = new FormGroup({
            searchField: new FormControl<'id' | 'name'>('id', {
                nonNullable: true,
            }),
            searchValue: new FormControl<string>('', { nonNullable: true }),
            signIn: new FormControl<'all' | 'signIn' | 'notSignIn'>('all', {
                nonNullable: true,
            }),
            prizeWinner: new FormControl<'all' | 'winner' | 'notWinner'>(
                'all',
                { nonNullable: true }
            ),
        });
    }

    ngOnInit(): void {
        this.store
            .select(ParticipantSelector.selectFilter)
            .pipe(first())
            .subscribe((filter) => {
                this.formGroup.setValue({
                    searchValue: filter.searchValue ?? '',
                    searchField: filter.searchField,
                    signIn:
                        filter.signedIn === undefined
                            ? 'all'
                            : filter.signedIn
                            ? 'signIn'
                            : 'notSignIn',
                    prizeWinner:
                        filter.prizeWinner === undefined
                            ? 'all'
                            : filter.prizeWinner
                            ? 'winner'
                            : 'notWinner',
                });
            });
    }

    updateParticipantFilter() {
        const { searchField, searchValue, signIn, prizeWinner } =
            this.formGroup.value;
        this.store.dispatch(
            ParticipantAction.setParticipantFilter({
                filter: {
                    searchField: searchField ?? 'id',
                    searchValue: searchValue ?? '',
                    signedIn:
                        signIn === 'all' ? undefined : signIn === 'signIn',
                    prizeWinner:
                        prizeWinner === 'all'
                            ? undefined
                            : prizeWinner === 'winner',
                },
            })
        );
    }
}
