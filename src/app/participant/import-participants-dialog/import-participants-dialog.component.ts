import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ParticipantDbService } from '../participant-db.service';
import { participantListCsvParser } from '../participant-list-csv-parser';

@Component({
    selector: 'app-import-participants-dialog',
    templateUrl: './import-participants-dialog.component.html',
    styleUrls: ['./import-participants-dialog.component.scss'],
})
export class ImportParticipantsDialogComponent implements OnInit {
    loading = false;
    errMsg = '';

    fileName = '';
    handlingImportedFile = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) drawId: string,
        private participantDbService: ParticipantDbService
    ) {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ngOnInit(): void {}

    onFileUpload(event: Event) {
        this.handlingImportedFile = true;
        const files = (event.target as HTMLInputElement).files;
        if (files === null || files.length === 0 || files.item(0) === null)
            return;
        this.fileName = files[0]?.name ?? '';
        const reader = new FileReader();
        reader.onload = () => {
            this.handlingImportedFile = false;
            if (!reader.result) return;
            try {
                const participants = participantListCsvParser(
                    reader.result.toString()
                );
                console.log(participants);
            } catch (error) {
                console.log(error);
            }
        };
        reader.readAsText(files[0]);
    }
}
