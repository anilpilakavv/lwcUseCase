import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import dismissEvent from '@salesforce/apex/SuggestionsController.dismissSchedule';

export default class SuggestionTile extends NavigationMixin(LightningElement) {
    @api suggestion;
    @track showScheduleModal = false;

    handleSuggestionSelected() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: 'view',
                recordId: this.suggestion.Id
            }
        });
    }

    confirmSchedule(){
        this.showScheduleModal = true;
    } 

    updateStatusChbx(){
        console.log('suggestion dismissed');
        /* this.suggestion.Status__c = true;
        this.suggestion.UserAction__c = "Dismissed"; */
        console.log('suggestion '+JSON.stringify(this.suggestion));
        dismissEvent({sugtnRecord: this.suggestion})
        .then(result => {

        })
        //Might need to use update record api and import the fields here.
        //This seems too simple and is likely to not actually write anything to the record, i'm guessing. 
        //Get record id of sugggestion object that is populating this tile. 
        //Query for that record(probably need a controller?). 
        //Update a the fields in that record. (might need to import the  fields?)
        //run method to clear the tile form the sugggestion list and/or... 
        //re-dispatch the event to repopulate the sugg tile list. 
    }

    removeSuggestionTile(){
        //Potentially a method to remove tile from list. 
        //Could be avoided by repopulating the entire list when you click a button on a tile.
    }

    handleCloseModal(event){
        this.showScheduleModal = event.detail; 
    }

}