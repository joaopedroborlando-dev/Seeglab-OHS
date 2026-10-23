import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ModalService } from './modal.service';
describe('ModalService', () => {
    let service: ModalService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideTranslateService()],
        });
        service = TestBed.inject(ModalService);
    });
    afterEach(() => service.closeModal()); // keep document.body clean between tests
    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should addd the modal to the body when opened', () => {
        service.open('Title', 'Message', 'Yes', 'No');
        expect(document.querySelector('app-confirmation-modal')).not.toBeNull();
    });
});
