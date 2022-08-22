import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ParticipantAction } from '../participant.action';

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

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ngOnInit(): void {}

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
