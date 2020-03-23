import { LightningElement, api, track } from 'lwc';
import confirmEvent from '@salesforce/apex/SuggestionsController.acceptSchedule';
import getAlternativeTimeSlot from '@salesforce/apex/SuggestionsController.getAlternativeTimeSlot';

export default class SchedulePopupCard extends LightningElement {
    @api suggestionModal;
    @api conflict = false;
    @api altTime;
    @api 
    confirmSchedule(){
        var modalVar = false; 
        //this.dispatchEvent(selectedEvent);
        confirmEvent({ sugRecord: this.suggestionModal, userAction: 'Accept', altTime: null })
        .then(result => {
            this.conflict=result;
            console.log('confirmEvent conflict.result = ' + this.conflict);
            if(!this.conflict)
            {
                console.log('Close Modal');
                const selectedEvent = new CustomEvent('closemodalvalue', {detail : modalVar}); 
                this.dispatchEvent(selectedEvent);
            }
            else
            {
                getAlternativeTimeSlot({ sugRecord: this.suggestionModal})
                .then(result => {
                    this.altTime=result;
                })
                .catch(error => {
                    console.log(error);
                });
            }
        })
        .catch(error => {
            console.log(error);
        });
    }
}