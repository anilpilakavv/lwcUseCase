public with sharing class SuggestionsController {
    
    
    @AuraEnabled(cacheable=true)
    public static list<Suggestion__c> getSuggestions() {
        list<Suggestion__c> suggestionsList = [SELECT id, Account__c, Account__r.Name, Rank__c, Status__c, Subject__c, SuggestedDateAndTime__c, UserAction__c, CreatedDate, Description_Rich_Text__c, ChannelType__c FROM Suggestion__c where Status__c = false ORDER BY CreatedDate DESC LIMIT 3]; 
        system.debug('suggestionsList '+suggestionsList);
        return suggestionsList;
    }

    @AuraEnabled(cacheable=true)
    public static list<Suggestion__c> getMoreSuggestions(Integer queryOffset){
        list<Suggestion__c> suggestionsList = [SELECT id, Account__c, Account__r.Name, Rank__c, Status__c, Subject__c, SuggestedDateAndTime__c, UserAction__c, CreatedDate, Description_Rich_Text__c, ChannelType__c FROM Suggestion__c where Status__c = false ORDER BY CreatedDate DESC LIMIT 3 OFFSET :queryOffset];  
        return suggestionsList;
    }

    public class suggestionRecordResult{
        @AuraEnabled
        public Integer totalRecordCount { get; set; }

        @AuraEnabled
        public List<Suggestion__c> suggestionRecords {get;set;}
    }

    @AuraEnabled(cacheable=true)
    public static suggestionRecordResult getSuggestionRecords(Integer queryOffset, String filterkey){

        suggestionRecordResult recordResult = new suggestionRecordResult();

        String countQuery = 'SELECT count() FROM Suggestion__c ';

        String query = 'SELECT id, Account__c, Account__r.Name, Rank__c, Status__c, Subject__c,' + 'SuggestedDateAndTime__c, UserAction__c, CreatedDate, Description_Rich_Text__c, ChannelType__c FROM Suggestion__c ';  

        if (!String.isBlank(filterkey)) {
            query = query + 'WHERE ChannelType__c =: filterkey AND Status__c = false';
            countQuery = countQuery + 'WHERE ChannelType__c =: filterkey AND Status__c = false';
        } else {
            query = query + 'WHERE Status__c = false';
        }

        query = query + ' ORDER BY CreatedDate DESC LIMIT 3 OFFSET :queryOffset';

        system.debug('query '+query);
        recordResult.suggestionRecords = Database.query(query);
        recordResult.totalRecordCount =(Integer) Database.countQuery(countQuery); 

        return recordResult;
    }

    @AuraEnabled
    public static void acceptSchedule(Suggestion__c sugRecord, String userAction){
        if(userAction == 'Accept'){
            Suggestion__c updatedRecord = new Suggestion__c(Id = sugRecord.Id, 
                                                            Status__c = true, 
                                                            UserAction__c = 'Accepted'); 
            update updatedRecord; 
            Event e = new Event(Type = sugRecord.ChannelType__c, 
                                Description = sugRecord.Subject__c, 
                                WhatId = sugRecord.Account__c, 
                                OwnerId = UserInfo.getUserId(), 
                                Suggestion__c = sugRecord.Id, 
                                DurationInMinutes = 30,
                                ActivityDateTime = sugRecord.SuggestedDateAndTime__c); 
            insert e;
        }
        /*else if(userAction == 'Dismiss'){
            Suggestion__c updatedRecord = new Suggestion__c(Id = sugRecord.Id, 
                                                        Status__c = true, 
                                                        UserAction__c = 'Dismissed'); 
        }*/
    }

    @AuraEnabled
    public static void dismissSchedule(Suggestion__c sugtnRecord){
        Suggestion__c updatedRecord = new Suggestion__c(Id = sugtnRecord.Id, 
                                                        Status__c = true, 
                                                        UserAction__c = 'Dismissed'); 
        update updatedRecord; 
    }
}