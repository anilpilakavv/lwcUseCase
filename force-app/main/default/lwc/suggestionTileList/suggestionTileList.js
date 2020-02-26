import { LightningElement, wire, track } from 'lwc';
import suggestionList from '@salesforce/apex/SuggestionsController.getSuggestions';

export default class SuggestionTileList extends LightningElement {
    @track suggestions;
    @track suggestionData;

    @wire(suggestionList)
    suggestionsList(result) {
        
        this.suggestions = result;
        if (result.data) {
            this.suggestionData = result.data;
            console.log(JSON.stringify(result));
            // this.columns = result.data.ldwList;
            // this.totalNumberOfRows = result.data.totalCount;
        }
    }

    loadMoreRecords(event){
       
        let area = this.template.querySelector('.scrollArea');
        let threshold = 2 * event.target.clientHeight;
        let areaHeight = area.clientHeight;
        let scrollTop = event.target.scrollTop;

        if(areaHeight - threshold < scrollTop) {            
           this.suggestionData = this.suggestionData.concat(this.suggestionData);
        }
        
    }
}