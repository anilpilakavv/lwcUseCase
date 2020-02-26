public with sharing class SuggestionFilterController {

    @auraEnabled(cacheable=true)
    public static List<Suggestion__c> getFilteredSuggestions(String filter) {
        List<Suggestion__c> filteredSugList = [SELECT Subject__c, Status__c FROM Suggestion__c WHERE Suggestion__c.ChannelType__c = :filter ];
        return filteredSugList;
    }
}
