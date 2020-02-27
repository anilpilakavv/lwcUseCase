import { LightningElement, api, wire } from 'lwc';
import{CurrentPageReference} from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

export default class SuggestionFilter extends LightningElement {
    @api filter; //filters in picklist in org are currently "Call" and "Email"

    @wire(CurrentPageReference) pageRef;  
    
    handleEvent(event){
        this.filter = event.target.name;
        fireEvent(this.pageRef, 'suggestionfilterselected', this.filter);
        console.log("Event handled. Filter is now ", this.filter);
    }
    
}

/*    
    @wire(getFilteredSuggestions,{f: '$filter'})    
    handleData(sList, error){
        if (sList) {
            this.filteredSugList = sList;
            this.error = undefined;
            console.log("List is true")
        } else if (error) {
            this.error = error;
            this.filteredSugList = undefined;
            console.log("List is false")
        } 
        console.log("Wire Triggered. List is ", this.filteredSugList);       
    }  
    */ 

/*  Needs to currently have two options: (Filter by channel type)
        Sort by Schedule
        Sort by Email
    Should we make this dynamic so we can add further sorting options in the future?
    Sorting options should show on side of screen
    
    Sorter should gather up the suggestion objects, sort them, and then pass them out to the suggestionTileList component
    This should happen each time a sort button is clicked

    Requirements:
    Ability to get the suggestions from the org and sort them
        -SOQL query, and a sort method?
            Make sure we only get relevant suggestions.
        -Should I query it each time it's clicked, or only sort the existing list?
            Query each time. We want to compensate for newly added or removed suggestions. 
    Event listener to watch for users clicks

    Event dispatcher to distribute the new list out to the Suggestion Tile list

*/