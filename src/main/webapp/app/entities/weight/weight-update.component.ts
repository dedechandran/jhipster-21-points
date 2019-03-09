import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IWeight } from 'app/shared/model/weight.model';
import { WeightService } from './weight.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-weight-update',
    templateUrl: './weight-update.component.html'
})
export class WeightUpdateComponent implements OnInit {
    weight: IWeight;
    isSaving: boolean;

    users: IUser[];
    dateDp: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected weightService: WeightService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ weight }) => {
            this.weight = weight;
        });
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUser[]>) => response.body)
            )
            .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.weight.id !== undefined) {
            this.subscribeToSaveResponse(this.weightService.update(this.weight));
        } else {
            this.subscribeToSaveResponse(this.weightService.create(this.weight));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IWeight>>) {
        result.subscribe((res: HttpResponse<IWeight>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
}
