import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TwentyOnePointsSharedModule } from 'app/shared';
import {
    BloodComponent,
    BloodDetailComponent,
    BloodUpdateComponent,
    BloodDeletePopupComponent,
    BloodDeleteDialogComponent,
    bloodRoute,
    bloodPopupRoute
} from './';

const ENTITY_STATES = [...bloodRoute, ...bloodPopupRoute];

@NgModule({
    imports: [TwentyOnePointsSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [BloodComponent, BloodDetailComponent, BloodUpdateComponent, BloodDeleteDialogComponent, BloodDeletePopupComponent],
    entryComponents: [BloodComponent, BloodUpdateComponent, BloodDeleteDialogComponent, BloodDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TwentyOnePointsBloodModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
