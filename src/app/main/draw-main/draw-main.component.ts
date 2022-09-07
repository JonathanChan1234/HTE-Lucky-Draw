import { Component, OnInit } from '@angular/core';
import { DrawMainService } from '../draw-main.service';

@Component({
    selector: 'app-draw-main',
    templateUrl: './draw-main.component.html',
    styleUrls: ['./draw-main.component.scss'],
})
export class DrawMainComponent implements OnInit {
    items: string[] = [
        'Pooh',
        'Tigger',
        'Daisy',
        'Sally',
        'Penguin',
        'Bear Bear',
    ];
    groups: { winner: string; items: string[] }[] = [
        { winner: 'Pooh', items: this.items },
        { winner: 'Tigger', items: this.items },
        { winner: 'Daisy', items: this.items },
        { winner: 'Sally', items: this.items },
        { winner: 'Penguin', items: this.items },
    ];

    constructor(private drawMainService: DrawMainService) {}

    ngOnInit(): void {}

    startDraw(): void {
        this.drawMainService.startDraw();
    }
}
