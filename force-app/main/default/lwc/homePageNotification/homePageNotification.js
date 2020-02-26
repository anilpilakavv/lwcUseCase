import { LightningElement, track, wire } from 'lwc';
import getNoOfSuggestions from '@salesforce/apex/HomePageController.getSuggestions'; 
import { NavigationMixin} from 'lightning/navigation';

export default class HomePageNotification extends NavigationMixin(LightningElement) {
    @track noOfSuggestions; 

    @wire(getNoOfSuggestions)
    noOfSuggestions; 


    navigateToSuggestions(){
        console.log(' navigate');
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                // CustomTabs from managed packages are identified by their
                // namespace prefix followed by two underscores followed by the
                // developer name. E.g. 'namespace__TabName'
                apiName: 'SuggestionsLWC'
            }
        });
    }
    

}