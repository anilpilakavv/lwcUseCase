import { LightningElement, track, wire  } from 'lwc';
import getInsights from '@salesforce/apex/insightsController.getInsights';

export default class InsightTileList extends LightningElement {

    @track insights = []; 
    @track insight; 
    @track iconuppriority; 
    @track iconupbrand; 
    @track iconupdate; 

    @wire(getInsights) 
    insights; 

    sortbyPriority(){

    }
    sortbyBrand(){

    }
    sortbyDate(){
        
    }

}