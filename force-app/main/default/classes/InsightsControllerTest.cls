@isTest
public with sharing class InsightsControllerTest {
    
    @IsTest
    static void method1(){
        Insight__c i1 = new Insight__c(
            Name= 'test1', 
            Brand__c = 'GENERAL', 
            Priority__c = 'Low', 
            Description__c = 'In the test class', 
            Subject__c = 'Test class subject', 
            Highlight__c = true
        ); 
        insert i1; 
    }

    @IsTest
    static void method2(){
        
        Test.startTest();
        method1(); 
        List<Insight__c> returnList = new List<Insight__c>(); 
        returnList = InsightsController.getInsights(); 
        Test.stopTest();
        system.assertNotEquals(returnList, null); 
        
    }
    @IsTest
    static void method3(){
        
        Test.startTest();
        method1(); 
        List<Insight__c> returnList = new List<Insight__c>(); 
        returnList = InsightsController.getInsightSorted('Priority'); 
        returnList = InsightsController.getInsightSorted('Brand'); 
        returnList = InsightsController.getInsightSorted('Posted Date'); 
        Test.stopTest();
        system.assertNotEquals(returnList, null); 
        
    }

    @IsTest
    static void method4(){
        
        Test.startTest();
        method1(); 
        List<Insight__c> returnList = new List<Insight__c>(); 
        returnList = InsightsController.getHighlightsController(); 
        Test.stopTest();
        system.assertNotEquals(returnList, null); 
        
    }
}
