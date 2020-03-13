@isTest
public with sharing class HomePageControllerTest {
    
    @IsTest
    static void method1(){
        
        Test.startTest();
        Integer noOfSuggestions = HomePageController.getSuggestions(); 
        Test.stopTest();
        system.assertNotEquals(noOfSuggestions, null);
    }

    @IsTest
    static void method2(){
        Contact c1 = new Contact(LastName = 'test1');
        insert c1;  
        Test.startTest();
        List<contact> conList = new List<Contact>();
        conList= contactController.getContacts(); 
        Test.stopTest();
        system.assertNotEquals(conList, null);
    }
}
