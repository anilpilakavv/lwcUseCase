public with sharing class insightsController {
    
    @AuraEnabled(cacheable=true)
    public static List<Insight__c> getInsights(){
        List<Insight__c> insightsList = [Select Id, name, Description__c, Brand__c, CreatedDate from Insight__c]; 
        return insightsList; 
    }
}
