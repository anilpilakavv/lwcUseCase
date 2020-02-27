import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import suggestionList from '@salesforce/apex/SuggestionsController.getSuggestions';
import getMoreSuggestions from '@salesforce/apex/SuggestionsController.getMoreSuggestions';

export default class SuggestionTileList extends LightningElement {
    @track suggestions;
    @track suggestionData;
    queryOffset = 0;
    @track loaded = false;


    @wire(CurrentPageReference) pageRef;

    //Lifecycle hook which fires when a component is inserted into the DOM
    connectedCallback(){
            //subscribing to the event
            registerListener('suggestionfilterselected', this.suggestionfiltersubmit, this);            
    }  
    
    suggestionfiltersubmit(filterkey){
        console.log(' Filter key value from main component' , filterkey);
    }

    @wire(suggestionList)
    suggestionsList(result){  
        this.suggestions = result;
        if (result.data) {
            this.suggestionData = result.data;
        }
    }

    loadMoreRecords(event){       
        let area = this.template.querySelector('.scrollArea');
        let threshold = 2 * event.target.clientHeight;
        let areaHeight = area.clientHeight;
        let scrollTop = event.target.scrollTop;

        if(areaHeight - threshold < scrollTop) { 
            this.loaded = true;
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
           this.loaded = false;            
        }
        
    }

    //Lifecycle hook which fires when a component is removed from the DOM
    disconnectedCallback() {
        unregisterAllListeners(this);
    }
}