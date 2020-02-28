import { LightningElement, api} from 'lwc';

export default class HighlightCard extends LightningElement {
    @api highlight;
    @api subject;
    @api date;
    icon = "utility:monthlyview";
    
}