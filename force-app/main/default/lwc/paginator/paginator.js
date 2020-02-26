import { LightningElement, track, api } from 'lwc';

export default class Paginator extends LightningElement {
@track leftalign ='left'; 
@track rightalign = 'right';
@api currentPage; 
@api pagesize = 5;

    get firstDisable(){
        if(this.currentPage == 1){
            return true; 
        }
        return false; 
    }

    get lastDisable(){
        if (Math.ceil(this.totalrecords / this.pagesize) === this.currentpage){
            return true; 
        }
        return false; 
    }

    @api
    handleNext(){
        this.dispatchEvent(new CustomEvent('next')); 
    }
   /*  handleFirst(){
        this.dispatchEvent(new CustomEvent('first')); 
    } */
    handlePrevious(){
        this.dispatchEvent(new CustomEvent('previous')); 
    }
    /* handleLast(){
        this.dispatchEvent(new CustomEvent('last')); 
    }
 */

}