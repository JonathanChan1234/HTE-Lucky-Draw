import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Participant } from 'src/app/participant/participant';
import { ParticipantPublicService } from 'src/app/service/participant-public/participant-public.service';

interface ParticipantSignInForm {
    participantId: FormControl<string>;
}

@Component({
    selector: 'app-participant-sign-in',
    templateUrl: './participant-sign-in.component.html',
    styleUrls: ['./participant-sign-in.component.scss'],
})
export class ParticipantSignInComponent implements OnInit {
    formGroup: FormGroup<ParticipantSignInForm>;

    // route params
    userId?: string;
    drawId?: string;

    // false when the params userId or drawId does not exist
    validLink = true;

    // request state
    loading = false;
    err = '';
    participant?: Participant;

    constructor(
        route: ActivatedRoute,
        private participantPublicService: ParticipantPublicService
    ) {
        this.userId = route.snapshot.params['userId'];
        this.drawId = route.snapshot.params['drawId'];

        if (!this.userId || !this.drawId) this.validLink = false;

        this.formGroup = new FormGroup({
            participantId: new FormControl<string>('', {
                validators: Validators.required,
                nonNullable: true,
            }),
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ngOnInit(): void {}

    signIn(): void {
        const { participantId } = this.formGroup.value;

        if (!this.userId || !this.drawId) {
            this.err =
                'Empty Draw ID. Please check the URL provided by the draw master again';
            this.validLink = false;
            return;
        }
        if (!participantId) {
            this.err = 'Empty Participant ID';
            return;
        }
        this.loading = true;
        this.participantPublicService
            .signIn(this.userId, this.drawId, participantId)
            .subscribe({
                next: (participant) => {
                    this.loading = false;
                    this.err = '';
                    this.participant = participant;
                },
                error: (error) => {
                    this.loading = false;
                    this.err = error.message;
                },
            });
    }
}
