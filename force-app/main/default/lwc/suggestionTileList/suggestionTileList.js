import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import suggestionList from '@salesforce/apex/SuggestionsController.getSuggestions';
import getSuggestionRecords from '@salesforce/apex/SuggestionsController.getSuggestionRecords';
import HideLightningHeader from '@salesforce/resourceUrl/HideLightningHeader';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';

export default class SuggestionTileList extends LightningElement {
    @track suggestions;
    @track suggestionData;
    queryOffset = 0;
    @track loaded = false;
    filterkey = '';
    @track pageheader; 


    @wire(CurrentPageReference) pageRef;

    //Lifecycle hook which fires when a component is inserted into the DOM
    connectedCallback(){
            //subscribing to the event
            registerListener('suggestionfilterselected', this.suggestionfiltersubmit, this);
            console.log('calling from connectedCallback');   
            loadStyle(this, HideLightningHeader);
    }  
    
    suggestionfiltersubmit(filterkey){
        console.log(' Filter key value from main component' , filterkey);
        this.queryOffset = 0;
        this.filterkey = filterkey;
        this.suggestionData = [];
        getSuggestionRecords({queryOffset: this.queryOffset, filterkey: filterkey})
            .then(result => {
             // Adding the records at the bottom of current list
             this.suggestionData = result.suggestionRecords;
            })
            .catch(error => {
            console.log('-------error-------------'+JSON.stringify(error));
             console.log(error);
        });
    }

    @wire(suggestionList)
    suggestionsList(result){  
        this.suggestions = result;
        if (result.data) {
            this.suggestionData = result.data;
            console.log('suggestiondata '+JSON.stringify(this.suggestionData));
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
                getSuggestionRecords({queryOffset: this.queryOffset, filterkey: this.filterkey})
                    .then(result => {
                    // Adding the records at the bottom of current list
                    this.suggestionData = this.suggestionData.concat(result.suggestionRecords);
                    //console.log('filter records '+JSON.stringify(result));
                    console.log('this.suggestionData'+JSON.stringify(this.suggestionData));
                    })
                    .catch(error => {
                    console.log('-------error-------------'+JSON.stringify(error));
                    console.log(error);
                });
           }
           this.loaded = false;            
        }
        
    }

    handlesuggestionstatuschange(event){
        const detail = event.detail;
        if(detail === 'status changed'){
            this.queryOffset = 0;
            this.suggestionData = [];
            console.log('Inside status change event');
            getSuggestionRecords({queryOffset: this.queryOffset, filterkey: this.filterkey})
                .then(result => {
                this.suggestionData = result.suggestionRecords;
                })
                .catch(error => {
                console.log('-------error-------------'+JSON.stringify(error));
                console.log(error);
            });
        }
    }

    //Lifecycle hook which fires when a component is removed from the DOM
    disconnectedCallback() {
        unregisterAllListeners(this);
       
    }

    /* renderedCallback(){
       this.pageheader= this.querySelector('slds-page-header');
       this.pageheader= 'display:none';
    } */
}