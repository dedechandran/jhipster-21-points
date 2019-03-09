/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { BloodDetailComponent } from 'app/entities/blood/blood-detail.component';
import { Blood } from 'app/shared/model/blood.model';

describe('Component Tests', () => {
    describe('Blood Management Detail Component', () => {
        let comp: BloodDetailComponent;
        let fixture: ComponentFixture<BloodDetailComponent>;
        const route = ({ data: of({ blood: new Blood(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [BloodDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(BloodDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(BloodDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.blood).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
