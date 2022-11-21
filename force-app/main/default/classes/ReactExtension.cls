public with sharing class ReactExtension {
	public String[] jsAssets { get; set; }
	public String[] cssAssets { get; set; }

	class Manifest {
		public String[] entrypoints;
	}

	public ReactExtension() {
		this.jsAssets = new String[]{};
		this.cssAssets = new String[]{};
		
		Manifest manifest = (Manifest)JSON.deserialize(
			PageReference.forResource('my_app', 'build/asset-manifest.json').getContent().toString(),
			Manifest.class
		);
		
		for (String asset : manifest.entrypoints) {
			if (asset.right(3) == '.js') {
				this.jsAssets.add(asset);
			} else if (asset.right(4) == '.css') {
				this.cssAssets.add(asset);
			}
		}
	}
	
	public ReactExtension(Object o){
		this();
	}
	
	public ReactExtension(ApexPages.standardController c){
		this();
	}
}
