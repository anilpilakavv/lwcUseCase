trigger SuggestionTrigger on Suggestion__c (after insert) {
    if(Trigger.isAfter && Trigger.isInsert){
        /*
        Suggestion__c suggestion = Trigger.new[0];
        Map<String, Object> suggestionFieldsMapToPublish = new Map<String, Object>();
        Map<String, Schema.SObjectField> suggestionFieldsMap = Schema.SObjectType.Suggestion__c.fields.getMap();

        for(String fieldName : suggestionFieldsMap.keySet()){
            suggestionFieldsMapToPublish.put(fieldName, suggestion.get(fieldName));
        } */

        //String serializedFieldValues = JSON.serialize(suggestionFieldsMapToPublish);

        String serializedFieldValues = SuggestionsController.getRecordsWhenPlatformEventFires();

        Suggestion_Insert__e notifySuggestion = new Suggestion_Insert__e(Message__c = serializedFieldValues);
        Database.SaveResult result = EventBus.publish(notifySuggestion);

        if (!result.isSuccess()) {
            for (Database.Error error : result.getErrors()) {
                System.debug('Error returned: ' + error.getStatusCode() +' - '+ error.getMessage());
            }
        }
    }
}