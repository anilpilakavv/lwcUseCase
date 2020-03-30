import { LightningElement, track, wire  } from 'lwc';
import getInsights from '@salesforce/apex/insightsController.getInsights';
import sortedList from '@salesforce/apex/insightsController.getInsightSorted'; 
import HideLightningHeader from '@salesforce/resourceUrl/HideLightningHeader';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';

export default class InsightTileList extends LightningElement {

    @track insights = []; 
    @track insight; 
    @track iconuppriority; 
    @track iconupbrand; 
    @track iconupdate; 
    @track activebtn = '';
    @track btn; 

    connectedCallback(){
        loadStyle(this, HideLightningHeader);
        //this.template.querySelector('.dateBtn').classList.add('highlightBtn');
    }
    
    constructor(){
        super(); 
        //this.template.querySelector('.dateBtn').classList.add('highlightBtn'); 
    }

    @wire(getInsights) 
    getInsights(result){
        if (result.data) {
            this.insights = result.data;
            //console.log('suggestiondata '+JSON.stringify(this.suggestionData));
        }
        
    }

    sortbyPriority(){
        console.log('insights before '+JSON.stringify(this.insights))
        this.template.querySelector('.priorityBtn').classList.add('highlightBtn');
        this.template.querySelector('.brandBtn').classList.remove('highlightBtn');
        this.template.querySelector('.dateBtn').classList.remove('highlightBtn'); 
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
       
       /*  this.highlightPriority = ''; 
        this.highlightBrand='button_margin'; 
        this.highlightDate=''; */
        sortedList({sortField : 'Brand'})
            .then(result => {
                this.insights = result;
            })
            console.log('insights '+JSON.stringify(this.insights.data));
            this.template.querySelector('.priorityBtn').classList.remove('highlightBtn');
            this.template.querySelector('.brandBtn').classList.add('highlightBtn');
            this.template.querySelector('.dateBtn').classList.remove('highlightBtn'); 
            this.classList.remove('activebtn');
    }
    sortbyDate(){
        this.template.querySelector('.priorityBtn').classList.remove('highlightBtn');
        this.template.querySelector('.brandBtn').classList.remove('highlightBtn');
        this.template.querySelector('.dateBtn').classList.add('highlightBtn'); 
        /* this.highlightPriority = ''; 
        this.highlightBrand=''; 
        this.highlightDate='button_margin'; */
        sortedList({sortField : 'Posted Date'})
            .then(result => {
                this.insights = result;
            })
            console.log('insights '+JSON.stringify(this.insights.data));
    }

}