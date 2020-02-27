import { LightningElement, api } from 'lwc';

export default class InsightTile extends LightningElement {
    @api insight; 

    get formattedDate(){
        var date = new Date(this.insight.CreatedDate);
        var month = date.toLocaleString('default', { month: 'short' }); 
        var monthcaps = month.toUpperCase(); 
        console.log('month '+JSON.stringify(month));  
        var year = date.getFullYear(); 
        var day = date.toISOString().slice(8,10);
        return monthcaps +' '+day+','+year; 

    }
}