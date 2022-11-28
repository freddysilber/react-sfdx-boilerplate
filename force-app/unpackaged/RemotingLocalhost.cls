@RestResource(urlMapping='/remoting/*')
global class RemotingLocalhost {
	@HttpPost
	global static void doPost() {
		String requestBodyJSON = RestContext.request.requestBody.toString();
		Map<String, Object> meta = (Map<String, Object>)JSON.deserializeUntyped(requestBodyJSON);
		Remoting.Request req = new Remoting.JSONRequest((String)meta.get('apexType'), requestBodyJSON);
		RestContext.response.responseBody = Blob.valueof(JSON.serialize(Remoting.execute(req)));
	}
}