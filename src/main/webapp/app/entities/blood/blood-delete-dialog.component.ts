import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBlood } from 'app/shared/model/blood.model';
import { BloodService } from './blood.service';

@Component({
    selector: 'jhi-blood-delete-dialog',
    templateUrl: './blood-delete-dialog.component.html'
})
export class BloodDeleteDialogComponent {
    blood: IBlood;

    constructor(protected bloodService: BloodService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.bloodService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'bloodListModification',
                content: 'Deleted an blood'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-blood-delete-popup',
    template: ''
})
export class BloodDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ blood }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(BloodDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.blood = blood;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/blood', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/blood', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
