import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Blood } from 'app/shared/model/blood.model';
import { BloodService } from './blood.service';
import { BloodComponent } from './blood.component';
import { BloodDetailComponent } from './blood-detail.component';
import { BloodUpdateComponent } from './blood-update.component';
import { BloodDeletePopupComponent } from './blood-delete-dialog.component';
import { IBlood } from 'app/shared/model/blood.model';

@Injectable({ providedIn: 'root' })
export class BloodResolve implements Resolve<IBlood> {
    constructor(private service: BloodService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IBlood> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Blood>) => response.ok),
                map((blood: HttpResponse<Blood>) => blood.body)
            );
        }
        return of(new Blood());
    }
}

export const bloodRoute: Routes = [
    {
        path: '',
        component: BloodComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'twentyOnePointsApp.blood.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: BloodDetailComponent,
        resolve: {
            blood: BloodResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.blood.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: BloodUpdateComponent,
        resolve: {
            blood: BloodResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.blood.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: BloodUpdateComponent,
        resolve: {
            blood: BloodResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.blood.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const bloodPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: BloodDeletePopupComponent,
        resolve: {
            blood: BloodResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.blood.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
