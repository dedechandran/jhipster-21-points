import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBlood } from 'app/shared/model/blood.model';

@Component({
    selector: 'jhi-blood-detail',
    templateUrl: './blood-detail.component.html'
})
export class BloodDetailComponent implements OnInit {
    blood: IBlood;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ blood }) => {
            this.blood = blood;
        });
    }

    previousState() {
        window.history.back();
    }
}
