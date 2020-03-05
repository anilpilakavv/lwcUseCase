import { LightningElement, api } from 'lwc';
import confirmEvent from '@salesforce/apex/SuggestionsController.acceptSchedule';

export default class SchedulePopupCard extends LightningElement {
    @api suggestionModal;

    @api 
    confirmSchedule(){
        var modalVar = false; 
        const selectedEvent = new CustomEvent('closemodalvalue', {detail : modalVar}); 
        this.dispatchEvent(selectedEvent);
        confirmEvent({sugRecord: this.suggestionModal})
        .then(result => {

        })
    }
}