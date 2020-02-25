import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class SuggestionTile extends NavigationMixin(LightningElement) {
    @api suggestion;

    handleSuggestionSelected() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: 'view',
                recordId: this.suggestion.Id
            }
        });
    }

}