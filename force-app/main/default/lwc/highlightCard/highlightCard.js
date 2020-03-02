import { LightningElement, api} from 'lwc';

export default class HighlightCard extends LightningElement 
{
    @api highlight;
    icon = "action:preview";
}