import { LightningElement, wire } from 'lwc';
import suggestionList from '@salesforce/apex/SuggestionsController.getSuggestions';

export default class SuggestionTileList extends LightningElement {
    @wire(suggestionList)
    suggestions;
}