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
        
        String query = 'SELECT id, Account__c, Account__r.Name, Rank__c, Status__c, Subject__c,' +
        'SuggestedDateAndTime__c, UserAction__c, CreatedDate, Description_Rich_Text__c, ChannelType__c FROM Suggestion__c ';  
        
        if (!String.isBlank(filterkey)) {
            query = query + 'WHERE ChannelType__c =: filterkey AND Status__c = false';
            countQuery = countQuery + 'WHERE ChannelType__c =: filterkey AND Status__c = false';
        } else {
            query = query + 'WHERE Status__c = false';
        }
        
        query = query + ' ORDER BY CreatedDate DESC LIMIT 3 OFFSET :queryOffset';
        
        recordResult.suggestionRecords = Database.query(query);
        
        System.debug('recordResult.suggestionRecords =' + recordResult.suggestionRecords);
        recordResult.totalRecordCount =(Integer) Database.countQuery(countQuery);
        
        return recordResult;
    }
    
    @AuraEnabled
    public static boolean acceptSchedule(Suggestion__c sugRecord, String userAction, Datetime altTime)
    {
        List<Suggestion__c> sugestion = 
        [SELECT id, Account__c, Subject__c, SuggestedDateAndTime__c, UserAction__c, ChannelType__c 
        FROM Suggestion__c 
        WHERE id=:sugRecord.id];
        
        System.debug('sugestion =' + sugestion);
        
        Boolean conflict = False;
        if(altTime == null)
        {
            conflict= !checkEventTimeSlot(sugestion[0]);
        }
        if(userAction == 'Accept' && !conflict)
        {
            Suggestion__c updatedRecord = new Suggestion__c(Id = sugRecord.Id, 
            Status__c = true, 
            UserAction__c = 'Accepted'); 
            update updatedRecord; 
            
            Event e = new Event(Type = sugestion[0].ChannelType__c,
            Subject = sugestion[0].ChannelType__c,
            Description = sugestion[0].Subject__c, 
            WhatId = sugestion[0].Account__c, 
            OwnerId = UserInfo.getUserId(), 
            Suggestion__c = sugestion[0].Id, 
            DurationInMinutes = 30);
            
            if(altTime == null)
            {
                e.ActivityDateTime = sugestion[0].SuggestedDateAndTime__c;
            }
            else
            {
                e.ActivityDateTime = altTime;
            }
            insert e;
        }
        System.debug('Conflict = ' + conflict);
        return conflict;
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
    
    @AuraEnabled
    public static boolean checkEventTimeSlot(Suggestion__c sugRecord) //check Event Time Slot
    {
        System.debug('checkEventTimeSlot() sugRecord = ' + sugRecord);
        Datetime startDateTime = sugRecord.SuggestedDateAndTime__c;
        Date suggestedDate= date.newinstance(startDateTime.year(), startDateTime.month(), startDateTime.day()); //Suggested Event Date
        Time suggestedTime = Time.newInstance(startDateTime.hour(), startDateTime.minute(), startDateTime.second(), 0);
        
        
        Id owner= UserInfo.getUserId();
        List<Event> eventList= [Select OwnerId, StartDateTime, EndDateTime From Event where OwnerId=:owner and ActivityDate=:suggestedDate Order By StartDateTime];
        System.debug('eventList = ' + eventList);
        boolean unreservedTimeSlot=TRUE;
        for(Event e : eventList)
        {
            Time eventStartTime = Time.newInstance(e.StartDateTime.hour(), e.StartDateTime.minute(), e.StartDateTime.second(), 0);
            Time eventEndTime = Time.newInstance(e.EndDateTime.hour(), e.EndDateTime.minute(), e.EndDateTime.second(), 0);
            
            if(!(eventStartTime>= suggestedTime && eventEndTime<suggestedTime))
            {
                unreservedTimeSlot=FALSE;
                break;
            }
        }
        return unreservedTimeSlot;
    }
    
    @AuraEnabled
    public static List<Datetime> getAlternativeTimeSlot(Suggestion__c sugRecord)
    {
        List<Datetime> altTimeList = new List<Datetime>(); //Alternate Time List
        
        Datetime startDateTime = sugRecord.SuggestedDateAndTime__c;
        
        boolean unreservedTimeSlot=TRUE;
        Time altTime = Time.newInstance(6, 0, 0 , 0);
        Time timeEnd = Time.newInstance((altTime.hour()+8), 0, 0, 0);
        Date suggestedDate= date.newinstance(startDateTime.year(), startDateTime.month(), startDateTime.day()); //Suggested Event Date
        
        Id owner= UserInfo.getUserId();
        List<Event> eventList= [Select OwnerId, StartDateTime, EndDateTime From Event where OwnerId=:owner and ActivityDate=:suggestedDate Order By StartDateTime];
        
        do
        {
            unreservedTimeSlot=TRUE;
            integer eventIterate=0;
            for(Event e : eventList)
            {
                Time eventStartTime = Time.newInstance(e.StartDateTime.hour(), e.StartDateTime.minute(), e.StartDateTime.second(), 0);
                Time eventEndTime = Time.newInstance(e.EndDateTime.hour(), e.EndDateTime.minute(), e.EndDateTime.second(), 0);
                
                if(eventStartTime == altTime)
                {
                    unreservedTimeSlot=FALSE;
                    break;
                }
            }
            if(unreservedTimeSlot)
            {
                Datetime dt = DateTime.newInstance(suggestedDate.year(), suggestedDate.month(), suggestedDate.day(),altTime.hour(), altTime.minute(), altTime.second());
                altTimeList.add(dt);
            }

            // Add 30 Mins to check next available time slot
            Integer hour = altTime.hour();
            Integer minute = altTime.minute();
            minute = minute + 30;
            if(minute==60)
            {
                minute=0;
                hour = hour + 1;
            }
            altTime = Time.newInstance(hour, minute, 0 , 0);
        }
        while(altTime < timeEnd);

        return altTimeList;
    }
}