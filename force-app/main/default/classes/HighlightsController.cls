public class HighlightsController {
    public HighlightsController() {

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
