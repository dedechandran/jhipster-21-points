import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'points',
                loadChildren: './points/points.module#TwentyOnePointsPointsModule'
            },
            {
                path: 'weight',
                loadChildren: './weight/weight.module#TwentyOnePointsWeightModule'
            },
            {
                path: 'blood',
                loadChildren: './blood/blood.module#TwentyOnePointsBloodModule'
            },
            {
                path: 'preference',
                loadChildren: './preference/preference.module#TwentyOnePointsPreferenceModule'
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TwentyOnePointsEntityModule {}
