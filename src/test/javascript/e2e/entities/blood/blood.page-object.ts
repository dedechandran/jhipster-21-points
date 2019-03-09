import { element, by, ElementFinder } from 'protractor';

export class BloodComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-blood div table .btn-danger'));
    title = element.all(by.css('jhi-blood div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async clickOnLastDeleteButton() {
        await this.deleteButtons.last().click();
    }

    async countDeleteButtons() {
        return this.deleteButtons.count();
    }

    async getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class BloodUpdatePage {
    pageTitle = element(by.id('jhi-blood-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    dateInput = element(by.id('field_date'));
    systolicInput = element(by.id('field_systolic'));
    diastolicInput = element(by.id('field_diastolic'));
    userSelect = element(by.id('field_user'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setDateInput(date) {
        await this.dateInput.sendKeys(date);
    }

    async getDateInput() {
        return this.dateInput.getAttribute('value');
    }

    async setSystolicInput(systolic) {
        await this.systolicInput.sendKeys(systolic);
    }

    async getSystolicInput() {
        return this.systolicInput.getAttribute('value');
    }

    async setDiastolicInput(diastolic) {
        await this.diastolicInput.sendKeys(diastolic);
    }

    async getDiastolicInput() {
        return this.diastolicInput.getAttribute('value');
    }

    async userSelectLastOption() {
        await this.userSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async userSelectOption(option) {
        await this.userSelect.sendKeys(option);
    }

    getUserSelect(): ElementFinder {
        return this.userSelect;
    }

    async getUserSelectedOption() {
        return this.userSelect.element(by.css('option:checked')).getText();
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}

export class BloodDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-blood-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-blood'));

    async getDialogTitle() {
        return this.dialogTitle.getAttribute('jhiTranslate');
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
