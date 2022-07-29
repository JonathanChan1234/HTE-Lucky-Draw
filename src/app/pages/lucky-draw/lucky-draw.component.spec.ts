import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
    Component,
    DebugElement,
    Input,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatListHarness } from '@angular/material/list/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { Draw } from 'src/app/model/draw';
import { LuckyDrawService } from 'src/app/service/lucky-draw.service';

import { LuckyDrawComponent } from './lucky-draw.component';

@Component({
    selector: 'app-error-message-bar',
})
class TestErrorMessageBarComponent {
    @Input()
    errMsg!: string;
}

@Component({
    selector: 'app-loading-spinner',
})
class TestLoadingSpinnerComponent {
    @Input()
    msg!: string;
}

describe('LuckyDrawComponent (Success)', () => {
    let component: LuckyDrawComponent;
    let fixture: ComponentFixture<LuckyDrawComponent>;

    let spyRouter: jasmine.SpyObj<Router>;
    let spyLuckyDrawService: jasmine.SpyObj<LuckyDrawService>;
    let spyMatDialog: jasmine.SpyObj<MatDialog>;
    let spySnackBar: jasmine.SpyObj<MatSnackBar>;

    let debugElement: DebugElement;
    let loader: HarnessLoader;
    let getDrawList: any;

    const drawList: Draw[] = [
        new Draw('test 1', 'test 1', 0, 0, 0, false, false),
        new Draw('test 2', 'test 2', 0, 0, 0, false, false),
    ];

    beforeEach(async () => {
        spyRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
        spyLuckyDrawService = jasmine.createSpyObj<LuckyDrawService>(
            'luckyDrawService',
            ['getDrawList']
        );
        spyMatDialog = jasmine.createSpyObj<MatDialog>('matDialog', ['open']);
        spySnackBar = jasmine.createSpyObj<MatSnackBar>('matSnackBar', [
            'open',
        ]);

        const draws$ = cold('--x|', { x: drawList });
        const empty$ = cold('--x|', { x: [] });
        getDrawList = spyLuckyDrawService.getDrawList.and.returnValues(
            draws$,
            empty$
        );

        await TestBed.configureTestingModule({
            declarations: [
                LuckyDrawComponent,
                TestErrorMessageBarComponent,
                TestLoadingSpinnerComponent,
            ],
            imports: [
                MatButtonModule,
                MatIconModule,
                MatListModule,
                MatChipsModule,
                MatMenuModule,
                MatDividerModule,
                MatSnackBarModule,
            ],
            providers: [
                { provide: Router, useValue: spyRouter },
                { provide: LuckyDrawService, useValue: spyLuckyDrawService },
                { provide: MatDialog, useValue: spyMatDialog },
                { provide: MatSnackBar, useValue: spySnackBar },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(LuckyDrawComponent);
        component = fixture.componentInstance;

        debugElement = fixture.debugElement;
        loader = TestbedHarnessEnvironment.loader(fixture);
        fixture.detectChanges();
    });

    const getLoadingSpinner = () =>
        debugElement.query(By.css('.loading-spinner'));
    const getErrorMsgBar = () => debugElement.query(By.css('.err-msg-bar'));
    const getLuckDrawList = () => loader.getHarnessOrNull(MatListHarness);

    it('should render list of draws', async () => {
        expect(component).toBeTruthy();

        // 1. loading state
        // loading spinner should exist
        expect(getLoadingSpinner()).toBeTruthy();
        expect(getLoadingSpinner().attributes['msg']).toBe(
            'Fetching Your Lucky Draw List'
        );
        // error message bar shouldn't exist
        expect(getErrorMsgBar()).toBeNull();
        // list shouldn't exist
        expect(await getLuckDrawList()).toBeNull();

        // 2. Fetching Data Successfully
        getTestScheduler().flush();
        fixture.detectChanges();
        // loading spinner shouldn't exist
        expect(getLoadingSpinner()).toBeNull();
        expect(getErrorMsgBar()).toBeNull();
        const firstList = await getLuckDrawList();
        expect(firstList).toBeTruthy();
        if (!firstList) return;
        const firstListItems = await firstList.getItems();
        expect(firstListItems.length).toBe(2);
        const firstItem = await firstListItems[0].getLinesText();
        const secondItem = await firstListItems[1].getLinesText();
        expect(firstItem[0]).toBe('test 1');
        expect(secondItem[0]).toBe('test 2');

        // 3. Click the refresh button
        const refreshButton = await loader.getHarness(
            MatButtonHarness.with({ selector: '.refresh-btn' })
        );
        await refreshButton.click();
        fixture.detectChanges();
        expect(getLoadingSpinner()).toBeTruthy();
        expect(getErrorMsgBar()).toBeNull();
        const secondList = await getLuckDrawList();
        expect(secondList).toBeTruthy();
        if (!secondList) return;
        const secondListItems = await secondList.getItems();
        expect(secondListItems.length).toBe(2);

        // 4. Fetch data again
        getTestScheduler().flush();
        fixture.detectChanges();
        expect(getLoadingSpinner()).toBeNull();
        expect(getErrorMsgBar()).toBeNull();
        const thirdList = await getLuckDrawList();
        expect(thirdList).toBeNull();
        const emptyList = debugElement.query(By.css('.empty-draw-list'));
        expect(emptyList).toBeTruthy();

        expect(getDrawList).toHaveBeenCalledTimes(2);
    });
});

describe('LuckyDrawComponent (Error)', () => {
    let component: LuckyDrawComponent;
    let fixture: ComponentFixture<LuckyDrawComponent>;

    let spyRouter: jasmine.SpyObj<Router>;
    let spyLuckyDrawService: jasmine.SpyObj<LuckyDrawService>;
    let spyMatDialog: jasmine.SpyObj<MatDialog>;
    let spySnackBar: jasmine.SpyObj<MatSnackBar>;

    let debugElement: DebugElement;
    let loader: HarnessLoader;
    let getDrawList: any;

    beforeEach(async () => {
        spyRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
        spyLuckyDrawService = jasmine.createSpyObj<LuckyDrawService>(
            'luckyDrawService',
            ['getDrawList']
        );
        spyMatDialog = jasmine.createSpyObj<MatDialog>('matDialog', ['open']);
        spySnackBar = jasmine.createSpyObj<MatSnackBar>('matSnackBar', [
            'open',
        ]);

        const error$ = cold('--#|', null, new Error('test error'));
        getDrawList = spyLuckyDrawService.getDrawList.and.returnValue(error$);

        await TestBed.configureTestingModule({
            declarations: [
                LuckyDrawComponent,
                TestErrorMessageBarComponent,
                TestLoadingSpinnerComponent,
            ],
            imports: [
                MatButtonModule,
                MatIconModule,
                MatListModule,
                MatChipsModule,
                MatMenuModule,
                MatDividerModule,
                MatSnackBarModule,
            ],
            providers: [
                { provide: Router, useValue: spyRouter },
                { provide: LuckyDrawService, useValue: spyLuckyDrawService },
                { provide: MatDialog, useValue: spyMatDialog },
                { provide: MatSnackBar, useValue: spySnackBar },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(LuckyDrawComponent);
        component = fixture.componentInstance;

        debugElement = fixture.debugElement;
        loader = TestbedHarnessEnvironment.loader(fixture);
        fixture.detectChanges();
    });

    const getLoadingSpinner = () =>
        debugElement.query(By.css('.loading-spinner'));
    const getErrorMsgBar = () => debugElement.query(By.css('.err-msg-bar'));
    const getLuckDrawList = () => loader.getHarnessOrNull(MatListHarness);

    it('should render error message', async () => {
        expect(component).toBeTruthy();

        // 1. loading state
        // loading spinner should exist
        expect(getLoadingSpinner()).toBeTruthy();
        expect(getLoadingSpinner().attributes['msg']).toBe(
            'Fetching Your Lucky Draw List'
        );
        // error message bar shouldn't exist
        expect(getErrorMsgBar()).toBeNull();
        // list shouldn't exist
        expect(await getLuckDrawList()).toBeNull();

        // 2. Catch error when fetching error
        getTestScheduler().flush();
        fixture.detectChanges();
        // loading spinner shouldn't exist
        expect(getLoadingSpinner()).toBeNull();
        expect(getErrorMsgBar()).toBeTruthy();
        expect(component.errMsg).toBe('test error');
        const list = await getLuckDrawList();
        expect(list).toBeNull();

        expect(getDrawList).toHaveBeenCalled();
    });
});
