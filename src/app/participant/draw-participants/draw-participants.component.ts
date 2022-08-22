import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ScreenSizeService } from 'src/app/service/screen-size/screen-size.service';
import { ParticipantCreateDialogComponent } from '../participant-create-dialog/participant-create-dialog.component';

@Component({
    selector: 'app-draw-participants',
    templateUrl: './draw-participants.component.html',
    styleUrls: ['./draw-participants.component.scss'],
})
export class DrawParticipantsComponent implements OnInit {
    isSmallScreen$!: Observable<boolean>;

    constructor(
        private route: ActivatedRoute,
        private screenSizeService: ScreenSizeService,
        private matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.isSmallScreen$ = this.screenSizeService.isSmallScreen();
    }

    openCreateDialog() {
        const drawId = this.route.snapshot.paramMap.get('drawId');
        if (!drawId) return;
        this.matDialog.open(ParticipantCreateDialogComponent, { data: drawId });
    }
}
