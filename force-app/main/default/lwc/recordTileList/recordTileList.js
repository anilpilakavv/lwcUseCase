import { LightningElement, track, wire } from 'lwc';
import getContacts from '@salesforce/apex/contactController.getContacts';

export default class RecordTileList extends LightningElement {
    @track contacts=[]; 
    @track contact; 
    @track page = 1; 
    pageSize =5; // setting it as constant
    recordCount; 
    totalPages; 
    fullContacts =[]; 
    


    @wire(getContacts)
    wiredcontacts({data}){
        if(data){
            this.fullContacts = data; 
            console.log('data ',data);
            this.contacts = this.fullContacts.slice(0, this.pageSize); 
            this.recordCount = this.fullContacts.length; 
            this.totalPages = Math.ceil(this.recordCount/this.pageSize);
            console.log('data ',data);
            console.log('contacts ',this.contacts);
        }
    }

    handleNext(){
        if(this.page < this.totalPages){
            this.page = this.page +1; 
            console.log('page '+this.page);
            this.contacts = this.fullContacts.slice(((this.page-1)*this.pageSize)-1, (this.page*this.pageSize)-1); 
        }
    }
    handlePrevious(){
        if(this.page > 1){
            this.page = this.page -1; 
            console.log('previous page '+this.page);
             if(this.page === 1){
                 console.log('inside if ');
                this.contacts = this.fullContacts.slice(0, this.pageSize); 
                console.log('contacts ',JSON.stringify(this.contacts));
            } 
            else{
                this.contacts = this.fullContacts.slice(((this.page-1)*this.pageSize)-1, (this.page*this.pageSize)-1); 
                console.log('contacts ',JSON.stringify(this.contacts));
            }
        }
    }
    /* handleFirst(){
        this.page =1; 
    }
    handleLast(){
        this.page = this.totalPages; 
    } */


}