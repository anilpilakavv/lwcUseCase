import { LightningElement, track, wire } from 'lwc';
import getHighlightsController from '@salesforce/apex/insightsController.getHighlightsController';

export default class Highlights extends LightningElement
{
    @track highlights;
    errors;
    @track renderCards;

    @wire(getHighlightsController)
    wiredHighlights({ error, data }) {
        if (data) 
        {
            this.highlights = data;
            this.error = undefined;
            this.renderCards=true;
            console.log('highlights '+this.highlights);
        } 
        else if (error) 
        {
            this.error = error;
            this.highlights = undefined;
            this.renderCards=false;
        }
    }
}