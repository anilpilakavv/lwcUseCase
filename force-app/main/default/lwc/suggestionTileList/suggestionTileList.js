import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import suggestionList from '@salesforce/apex/SuggestionsController.getSuggestions';
import getSuggestionRecords from '@salesforce/apex/SuggestionsController.getSuggestionRecords';
import HideLightningHeader from '@salesforce/resourceUrl/HideLightningHeader';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';
import { refreshApex } from '@salesforce/apex';

export default class SuggestionTileList extends LightningElement {
    @track suggestions;
    @track suggestionData = [];
    queryOffset = 0;
    @track loaded = false;
    filterkey = '';
    @track pageheader; 
    @track channelName = '/event/Suggestion_Insert__e';

    @wire(CurrentPageReference) pageRef;

    //Lifecycle hook which fires when a component is inserted into the DOM
    connectedCallback(){
            //subscribing to the event
            registerListener('suggestionfilterselected', this.suggestionfiltersubmit, this);
            console.log('calling from connectedCallback');   
            loadStyle(this, HideLightningHeader);
            this.handleSubscribe();

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
            console.log('suggestions data : ' + JSON.stringify(this.suggestionData));
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

    handleSubscribe() {
        // Callback invoked whenever a new event message is received
        const messageCallback = function(response) {
            console.log('New message received : ', JSON.stringify(response));    

            this.suggestionData = [];
            const msg = response.data.payload.Message__c;
            console.log('data value : ', JSON.stringify(response.data));
            console.log('message value : ', msg);
            const sugg  = JSON.parse(msg).suggestionRecords;
            
            /*  window.clearTimeout(this.delayTimeout);
            this.delayTimeout = setTimeout(() => {
                this.suggestionData = sugg;
            }, 5000); */
            this.suggestionData = sugg;

            console.log('suggestions data after PE : ' + JSON.stringify(this.suggestionData));

            if(this.suggestionData){
                console.log('suggestions data is TRUE');
            }

            //return refreshApex(this.suggestionData);

            //to refresh the UI
            eval("$A.get('e.force:refreshView').fire();");


        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then(response => {
            // Response contains the subscription information on successful subscribe call
            console.log('Successfully subscribed to : ', JSON.stringify(response.channel));
        });
    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError(error => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }
}