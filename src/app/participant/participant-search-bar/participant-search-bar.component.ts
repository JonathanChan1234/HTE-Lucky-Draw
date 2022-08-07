import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ParticipantService } from '../participant.service';

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

    constructor(private participantService: ParticipantService) {
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

    ngOnInit(): void {}

    updateParticipantFilter() {
        const { searchField, searchValue, signIn, prizeWinner } =
            this.formGroup.value;
        this.participantService.updateSearchFilter({
            searchField: searchField ?? 'id',
            searchValue: searchValue ?? '',
            signedIn: signIn === 'all' ? undefined : signIn === 'signIn',
            prizeWinner:
                prizeWinner === 'all' ? undefined : prizeWinner === 'winner',
        });
    }
}
