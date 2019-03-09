/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { BloodUpdateComponent } from 'app/entities/blood/blood-update.component';
import { BloodService } from 'app/entities/blood/blood.service';
import { Blood } from 'app/shared/model/blood.model';

describe('Component Tests', () => {
    describe('Blood Management Update Component', () => {
        let comp: BloodUpdateComponent;
        let fixture: ComponentFixture<BloodUpdateComponent>;
        let service: BloodService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [BloodUpdateComponent]
            })
                .overrideTemplate(BloodUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(BloodUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BloodService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Blood(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.blood = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Blood();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.blood = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
