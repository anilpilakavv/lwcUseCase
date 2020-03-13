public with sharing class insightsController {
    
    @AuraEnabled(cacheable=true)
    public static List<Insight__c> getInsights(){
        List<Insight__c> insightsList = [Select Id, name, Description__c, Brand__c, CreatedDate from Insight__c]; 
        return insightsList; 
    }

    @AuraEnabled
    public static List<Insight__c> getInsightSorted(String sortField){
        String queryStr2 = 'Select Id, name, Description__c, Brand__c, CreatedDate from Insight__c '; 
        String queryStr1; 
        if(sortField == 'Priority'){
            queryStr1 = 'order by Priority__c';
        }
        else if(sortField == 'Brand'){
            queryStr1 = 'order by Brand__c';
        }
        else if(sortField == 'Posted Date'){
            queryStr1 = 'order by CreatedDate';
        }
        String query = queryStr2 + queryStr1; 
        List<Insight__c> insightsList = Database.query(query);
        system.debug('insightsList '+insightsList);
        return insightsList; 
    }

    @AuraEnabled (cacheable=true)
    public static List<Insight__c> getHighlightsController()
    {

        List<Insight__c> highlightsList = 
        [SELECT ID, Name, Description__c, Priority__c, Subject__c, createdDate
        FROM Insight__c
        WHERE Highlight__c=TRUE Order By createdDate Desc];

        return highlightsList;
    }
}
