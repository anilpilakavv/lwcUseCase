import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import dismissEvent from '@salesforce/apex/SuggestionsController.dismissSchedule';

export default class SuggestionTile extends NavigationMixin(LightningElement) {
    @api suggestion;
    @track showScheduleModal = false;
    showDescriptionModal = false;
   
    //to get the formated posted from created date time 
    get formattedDate(){
        var date = new Date(this.suggestion.CreatedDate);
        var month = date.getMonth();
        //var monthcaps = month.toUpperCase(); 
        //console.log('month '+JSON.stringify(month));  
        var year = date.getFullYear(); 
        var day = date.toISOString().slice(8,10);
        return month +'/'+day+'/'+year;  
    }

    get characterCount(){
        const descriptionText = this.suggestion.Description_Rich_Text__c;
        const textLength = descriptionText.length;
        var boolCount; 
        if(textLength > 500){
            boolCount = true; 
        }
        else{
            boolCount= false; 
        }
        return boolCount;
    }

    handleSuggestionSelected() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: 'view',
                recordId: this.suggestion.Id
            }
        });
    }

    rendermore(){
        this.showDescriptionModal = true;
    }

    hideDescriptionModal(){
        this.showDescriptionModal = false;
    }

    confirmSchedule(){
        console.log('confirm schedule ');
        this.showScheduleModal = true;
    } 

    updateStatusChbx(){
        console.log('suggestion dismissed');
        /* this.suggestion.Status__c = true;
        this.suggestion.UserAction__c = "Dismissed"; */
        console.log('suggestion '+JSON.stringify(this.suggestion));
        dismissEvent({sugtnRecord: this.suggestion})
        .then(result => {

        });

        // Creates the event with the data.
        const statusUpdatedEvent = new CustomEvent("suggestionstatusupdate", {
            detail: 'status changed'
        });

        // Dispatches the event.
        this.dispatchEvent(statusUpdatedEvent);

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