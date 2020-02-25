public with sharing class SuggestionsController {
    
    
    @AuraEnabled(cacheable=true)
    public static list<Suggestion__c> getSuggestions() {
        list<Suggestion__c> suggestionsList = [SELECT id, Account__c, Account__r.Name, Rank__c, Status__c, Subject__c, SuggestedDateAndTime__c, UserAction__c, CreatedDate, Description__c, Description_Rich_Text__c FROM Suggestion__c ORDER BY CreatedDate DESC];

        return suggestionsList;
    }
}
