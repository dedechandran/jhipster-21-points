import { JhiEventManager } from 'ng-jhipster';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { LoginModalService, AccountService, Account } from 'app/core';
import { PreferenceService } from 'app/entities/preference';
import { BloodService } from 'app/entities/blood';
import { WeightService } from 'app/entities/weight';
import { D3ChartService } from './d3-chart.service';
import { Preference } from 'app/shared/model/preference.model';
import { PointsService } from 'app/entities/points';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    account: Account;
    modalRef: NgbModalRef;
    eventSubscriber: Subscription;
    pointsThisWeek: any = {};
    pointsPercentage: number;

    constructor(
        private accountService: AccountService,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private pointsService: PointsService
    ) {}

    ngOnInit() {
        this.accountService.identity().then((account: Account) => {
            this.account = account;
            if (this.isAuthenticated()) {
                this.getUserData();
            }
        });
        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.accountService.identity().then(account => {
                this.account = account;
                this.getUserData();
            });
        });
        this.eventSubscriber = this.eventManager.subscribe('pointListModification', () => this.getUserData());
        this.eventSubscriber = this.eventManager.subscribe('bloodPressureListModification', () => this.getUserData());
        this.eventSubscriber = this.eventManager.subscribe('weightListModification', () => this.getUserData());
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    ngOnDestroy(): void {
        this.eventManager.destroy(this.eventSubscriber);
    }

    getUserData() {
        // Get points for the current week
        this.pointsService.thisWeek().subscribe((points: any) => {
            points = points.body;
            this.pointsThisWeek = points;
            this.pointsPercentage = (points.points / 21) * 100;
        });
        D3ChartService.getChartConfig();
    }
}
