import { LightningElement, track, wire  } from 'lwc';
import getInsights from '@salesforce/apex/insightsController.getInsights';
import sortedList from '@salesforce/apex/insightsController.getInsightSorted'; 

export default class InsightTileList extends LightningElement {

    @track insights = []; 
    @track insight; 
    @track iconuppriority; 
    @track iconupbrand; 
    @track iconupdate; 

    @wire(getInsights) 
    getInsights(result){
        if (result.data) {
            this.insights = result.data;
            //console.log('suggestiondata '+JSON.stringify(this.suggestionData));
        }
    }

    sortbyPriority(){
        console.log('insights before '+JSON.stringify(this.insights))
        sortedList({sortField : 'Priority'})
            .then(result => {

                this.insights = result;
                console.log('insights in priority '+JSON.stringify(this.insights));
            })
            .catch(error => {
                console.log('-------error-------------'+JSON.stringify(error));
                 console.log(error);
                });
            //console.log('insights in priority '+result);
    }
    sortbyBrand(){
        sortedList({sortField : 'Brand'})
            .then(result => {
                this.insights = result;
            })
            console.log('insights '+JSON.stringify(this.insights.data));
    }
    sortbyDate(){
        sortedList({sortField : 'Posted Date'})
            .then(result => {
                this.insights = result;
            })
            console.log('insights '+JSON.stringify(this.insights.data));
    }

}