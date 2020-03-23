import { LightningElement, track, wire } from 'lwc';
import getHighlightsController from '@salesforce/apex/insightsController.getHighlightsController';

export default class Highlights extends LightningElement
{
    highlights;
    errors;
    renderCards;

    @wire(getHighlightsController)
    wiredHighlights({ error, data }) {
        if (data) 
        {
            this.highlights = data;
            this.error = undefined;
            this.renderCards=true;
        } 
        else if (error) 
        {
            this.error = error;
            this.highlights = undefined;
            this.renderCards=false;
        }
    }
}