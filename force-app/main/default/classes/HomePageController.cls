public with sharing class HomePageController {
    
    @auraEnabled(cacheable=true)
    public static Integer getSuggestions(){
        Integer noSuggestions = [Select Count() from Suggestion__c where ExpirationDate__c < :System.Today() AND  Status__c=true]; 
        return noSuggestions; 
    }
}
