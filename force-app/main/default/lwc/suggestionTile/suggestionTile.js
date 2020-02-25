import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

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

}