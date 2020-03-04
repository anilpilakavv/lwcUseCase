import { LightningElement, wire, track } from 'lwc';
import getHighlightsController from '@salesforce/apex/HighlightsController.getHighlightsController';

export default class Highlights extends LightningElement
{
    highlights;
    errors;

    @wire(getHighlightsController)
    wiredHighlights({ error, data }) 
    {
        if (data) 
        {
            this.highlights = data;
            this.error = undefined;
        } 
        else if (error) 
        {
            this.error = error;
            this.highlights = undefined;
        }
    }
}