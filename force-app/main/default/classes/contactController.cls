public with sharing class contactController {
    
    @AuraEnabled(cacheable = true)
    public static List<Contact> getContacts(){
        List<Contact> contactlist = [Select Id, Name, Email, Phone from Contact]; 
        return contactlist; 
    }
}
