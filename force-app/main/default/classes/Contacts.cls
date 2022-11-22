public with sharing class Contacts {
    public class getContacts implements Remoting.Request {
        public Contact[] execute() {
            return [SELECT Id, Name FROM Contact];
        }
    }
}
