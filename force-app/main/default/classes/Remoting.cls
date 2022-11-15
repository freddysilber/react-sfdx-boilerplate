global class Remoting {
	// Use sharing when not operating within a Site
	private static final Boolean USE_SHARING = Site.getSiteId() == null;

	public Remoting() {}
	public Remoting(ApexPages.standardController c) {}
	public Remoting(Object o) {}

	public Interface Request {
		Object execute();
	}

	global virtual class JSONRequest implements Request {
		public String requestType { get; set; }
		public String data { get; set; }

		public String className {
			get {
				if (this.className == null) {
					this.className = '';
					try {
						DateTime typeCheck = (DateTime)(Object)this;
					} catch(System.TypeException ex) {
						this.className = ex.getMessage().substringAfter('Invalid conversion from runtime type ').substringBefore(' to Datetime');
					}
				}

				return this.className;
			}
			private set;
		}

		public String namespace {
			get {
				return this.className.split('\\.').get(0);
			}
		}

		global JSONRequest() {}
		public JSONRequest(String requestType, String data) {
			this.requestType = requestType;
			this.data = data;
		}

		public Object execute() {
			// Strip the namespace placeholder
			if (this.requestType.startsWith('c.')) {
				this.requestType = this.requestType.substring(2);
			}

			Type resolvedType = Type.forName(this.requestType);
			Request resolvedRequest;

			// If data is provided then we need to deserialize as requested type. Otherwise type can be instantiated
			if (this.data == null) {
				resolvedRequest = (Request)resolvedType.newInstance();
			} else {
				resolvedRequest = (Request)JSON.deserialize(this.data, resolvedType);
			}

			return resolvedRequest.execute();
		}
	}

	@RemoteAction
	public static Object execute(Request request) {
		return Remoting.getSharingContext().executeRequest(request);
	}

	@RemoteAction
	global static Object executeJSON(JSONRequest request) {
		if (Remoting.verifyJSONRequestOrigin(request)) {
			return Remoting.execute(request);
		}

		System.debug('Unauthorized origin');
		return null;
		// throw new CCProjexEnterpriseException('Unauthorized origin');
	}

	private static SharingContext getSharingContext() {
		if (Remoting.USE_SHARING) {
			return new WithSharingContext();
		}

		return new WithoutSharingContext();
	}

	// Method definition must be in sub-classes in order for sharing context to work
	interface SharingContext {
		Object executeRequest(Request request);
	}

	private with sharing class WithSharingContext implements SharingContext {
		public Object executeRequest(Request request) {
			return request.execute();
		}
	}

	private without sharing class WithoutSharingContext implements SharingContext {
		public Object executeRequest(Request request) {
			return request.execute();
		}
	}

	private static Set<String> validNamespaces = new Set<String>{ '', 'ccpe_ocp' };
	// private static Set<String> validNamespaces = new Set<String>{ PrefixesHelper.namespacePrefix, 'ccpe_ocp' };

	private static Boolean verifyJSONRequestOrigin(JSONRequest request) {
		return validNamespaces.contains(request.namespace);
	}
}