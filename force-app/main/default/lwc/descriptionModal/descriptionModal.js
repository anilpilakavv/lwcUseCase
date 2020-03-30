import { LightningElement, api } from 'lwc';

export default class DescriptionModal extends LightningElement {
    @api description;

    closeDescriptionModal(){
        // Creates the event with the data.
        const closeModal = new CustomEvent("closedescription", {
            detail: 'close Description'
        });

        // Dispatches the event.
        this.dispatchEvent(closeModal);
    }
}