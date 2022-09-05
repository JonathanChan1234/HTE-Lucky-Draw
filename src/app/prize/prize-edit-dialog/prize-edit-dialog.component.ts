import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { debounceTime, from, Observable, of, startWith, switchMap } from 'rxjs';
import { Participant } from 'src/app/participant/participant';
import { ParticipantDbService } from 'src/app/participant/participant-db.service';
import { Prize } from '../prize';
import { EditPrizeDao } from '../prize.action';
import { PrizeSelector } from '../prize.selector';

interface PrizeEditFormGroup {
    name: FormControl<string>;
    sponsor: FormControl<string>;
    sequence: FormControl<number>;
    assigned: FormControl<boolean>;
    winnerId: FormControl<string | null>;
}

@Component({
    selector: 'app-prize-edit-dialog',
    templateUrl: './prize-edit-dialog.component.html',
    styleUrls: ['./prize-edit-dialog.component.scss'],
})
export class PrizeEditDialogComponent implements OnInit {
    assignedFormControl: FormControl<boolean>;
    winnerIdFormControl: FormControl<string | null>;
    filterFormControl: FormControl<string> = new FormControl(
        this.prize.winner ?? '',
        {
            nonNullable: true,
        }
    );

    form: FormGroup<PrizeEditFormGroup>;
    filteredOptions!: Observable<Participant[]>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public prize: Prize,
        private matDialogRef: MatDialogRef<PrizeEditDialogComponent>,
        private readonly store: Store,
        private readonly participantService: ParticipantDbService
    ) {
        this.assignedFormControl = new FormControl(prize.assigned, {
            nonNullable: true,
        });
        this.winnerIdFormControl = new FormControl(prize.winnerId ?? '', {
            nonNullable: true,
        });
        if (!prize.assigned) this.winnerIdFormControl.disable();

        this.form = new FormGroup({
            name: new FormControl(prize.name, {
                validators: [Validators.required],
                nonNullable: true,
            }),
            sponsor: new FormControl(prize.sponsor ?? '', {
                validators: [Validators.required],
                nonNullable: true,
            }),
            sequence: new FormControl(prize.sequence, {
                validators: [
                    Validators.pattern(/^[1-9][0-9]*$/), // positive integer with no leading zero
                ],
                nonNullable: true,
            }),
            assigned: this.assignedFormControl,
            winnerId: this.winnerIdFormControl,
        });
    }

    ngOnInit(): void {
        this.assignedFormControl.valueChanges.subscribe((assigned) => {
            if (!assigned) this.winnerIdFormControl.disable();
            else this.winnerIdFormControl.enable();
        });
        this.filteredOptions = this.filterFormControl.valueChanges.pipe(
            startWith(this.prize.winner ?? ''),
            debounceTime(1000),
            switchMap((value) =>
                this.store.select(PrizeSelector.selectDrawId).pipe(
                    switchMap((drawId) => {
                        if (!drawId) return of([]);
                        return from(
                            this.participantService.getParticipants(drawId, 5, {
                                searchField: 'name',
                                searchValue: value || '',
                            })
                        );
                    })
                )
            )
        );
    }

    editPrize() {
        if (this.form.invalid) this.matDialogRef.close();
        const { name, sponsor, sequence, winnerId } = this.form.value;
        if (
            name === undefined ||
            sponsor === undefined ||
            sequence === undefined
        )
            return;
        const editPrizeDao: EditPrizeDao = {
            id: this.prize.id,
            name,
            sponsor,
            sequence,
            winnerId: winnerId ?? '',
        };
        this.matDialogRef.close(editPrizeDao);
    }
}
