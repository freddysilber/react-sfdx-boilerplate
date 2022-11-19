public with sharing class ReactExtension {

	public ReactExtension() {
		System.debug('HEY');
	}
	
	public ReactExtension(Object o){
		this();
	}
	
	public ReactExtension(ApexPages.standardController c){
		this();
	}
}
