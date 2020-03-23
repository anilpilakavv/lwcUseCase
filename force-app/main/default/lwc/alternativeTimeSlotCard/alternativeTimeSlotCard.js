import { LightningElement, track, wire, api } from 'lwc';
import getAlternativeTimeSlot from '@salesforce/apex/SuggestionsController.getAlternativeTimeSlot';

export default class AlternativeTimeSlotCard extends LightningElement 
{
    @api suggestionModal;
    @api conflict;
    @api altTime;

    findNextTimeSlot()
    {
        console.log('altTime result = ' + this.altTime);
    }

    selectionChangeHandler()
    {

    }
}