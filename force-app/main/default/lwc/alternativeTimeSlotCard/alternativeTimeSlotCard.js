import { LightningElement, track, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import confirmAlternativeTime from '@salesforce/apex/SuggestionsController.acceptSchedule';

export default class AlternativeTimeSlotCard extends LightningElement 
{
    @api suggestionModal;
    @api conflict;
    @api altTime;
    @track selectedTime= null;
    
    isPicklistDisabled = false;
    isAttributeRequired = true;
    
    selectionChangeHandler(event)
    {
        this.selectedTime = event.target.value;
    }
    
    confirmTimeSlotHandler()
    {
        if(this.selectedTime!=null || this.selectedTime!='Select')
        {
            confirmAlternativeTime({ sugRecord: this.suggestionModal, userAction: 'Accept', altTime: this.selectedTime })
            .then(result => {
                location.reload();
            })
            .catch(error => {
                console.log(error);
            });
        }
        else
        {
            const event = new ShowToastEvent({
                title: 'error',
                message: 'Alternative time slot not selected',
                variant: 'error',
            });
            this.dispatchEvent(event);
        }
    }
}