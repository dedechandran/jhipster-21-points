import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IBlood } from 'app/shared/model/blood.model';
import { BloodService } from './blood.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-blood-update',
    templateUrl: './blood-update.component.html'
})
export class BloodUpdateComponent implements OnInit {
    blood: IBlood;
    isSaving: boolean;

    users: IUser[];
    dateDp: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected bloodService: BloodService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ blood }) => {
            this.blood = blood;
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
        if (this.blood.id !== undefined) {
            this.subscribeToSaveResponse(this.bloodService.update(this.blood));
        } else {
            this.subscribeToSaveResponse(this.bloodService.create(this.blood));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IBlood>>) {
        result.subscribe((res: HttpResponse<IBlood>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
