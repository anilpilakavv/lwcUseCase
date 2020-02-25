import { LightningElement, track, wire } from 'lwc';
import getNoOfSuggestions from '@salesforce/apex/HomePageController.getSuggestions'; 

export default class HomePageNotification extends LightningElement {
    @track noOfSuggestions; 

    @wire(getNoOfSuggestions)
    noOfSuggestions; 

    

}