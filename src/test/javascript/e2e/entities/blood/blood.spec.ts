/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BloodComponentsPage, BloodDeleteDialog, BloodUpdatePage } from './blood.page-object';

const expect = chai.expect;

describe('Blood e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let bloodUpdatePage: BloodUpdatePage;
    let bloodComponentsPage: BloodComponentsPage;
    let bloodDeleteDialog: BloodDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Blood', async () => {
        await navBarPage.goToEntity('blood');
        bloodComponentsPage = new BloodComponentsPage();
        await browser.wait(ec.visibilityOf(bloodComponentsPage.title), 5000);
        expect(await bloodComponentsPage.getTitle()).to.eq('twentyOnePointsApp.blood.home.title');
    });

    it('should load create Blood page', async () => {
        await bloodComponentsPage.clickOnCreateButton();
        bloodUpdatePage = new BloodUpdatePage();
        expect(await bloodUpdatePage.getPageTitle()).to.eq('twentyOnePointsApp.blood.home.createOrEditLabel');
        await bloodUpdatePage.cancel();
    });

    it('should create and save Blood', async () => {
        const nbButtonsBeforeCreate = await bloodComponentsPage.countDeleteButtons();

        await bloodComponentsPage.clickOnCreateButton();
        await promise.all([
            bloodUpdatePage.setDateInput('2000-12-31'),
            bloodUpdatePage.setSystolicInput('5'),
            bloodUpdatePage.setDiastolicInput('5'),
            bloodUpdatePage.userSelectLastOption()
        ]);
        expect(await bloodUpdatePage.getDateInput()).to.eq('2000-12-31');
        expect(await bloodUpdatePage.getSystolicInput()).to.eq('5');
        expect(await bloodUpdatePage.getDiastolicInput()).to.eq('5');
        await bloodUpdatePage.save();
        expect(await bloodUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await bloodComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Blood', async () => {
        const nbButtonsBeforeDelete = await bloodComponentsPage.countDeleteButtons();
        await bloodComponentsPage.clickOnLastDeleteButton();

        bloodDeleteDialog = new BloodDeleteDialog();
        expect(await bloodDeleteDialog.getDialogTitle()).to.eq('twentyOnePointsApp.blood.delete.question');
        await bloodDeleteDialog.clickOnConfirmButton();

        expect(await bloodComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
