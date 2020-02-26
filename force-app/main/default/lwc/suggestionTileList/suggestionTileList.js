import { LightningElement, wire, track } from 'lwc';
import suggestionList from '@salesforce/apex/SuggestionsController.getSuggestions';
import getMoreSuggestions from '@salesforce/apex/SuggestionsController.getMoreSuggestions';

export default class SuggestionTileList extends LightningElement {
    @track suggestions;
    @track suggestionData;
    queryOffset = 0;

    @wire(suggestionList)
    suggestionsList(result) {
        
        this.suggestions = result;
        if (result.data) {
            this.suggestionData = result.data;
            //console.log(JSON.stringify(result));
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
            this.queryOffset = this.queryOffset + 3; 
            if(30 > this.queryOffset){
                getMoreSuggestions({queryOffset: this.queryOffset})
                .then(result => {
                    // Adding the records at the bottom of current list
                    this.suggestionData = this.suggestionData.concat(result);
                })
                .catch(error => {
                    console.log('-------error-------------'+error);
                    console.log(error);
                });
           }            
        }
        
    }
}