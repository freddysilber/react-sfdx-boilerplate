global with sharing class AccountRemoter {

	public class AccountException extends Exception { }

	public class getAccount implements Remoting.request {
		public String name { get; set; }

		public Account[] execute() {
			return [SELECT Id, Name FROM Account];
			// throw new AccountException('Error!');
		}
	}
}