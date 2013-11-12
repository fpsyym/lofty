define("lofty/lang/doc/context/complex/combox", ['alicn/geoinfo/1.0', 'jquery'],function(Geoinfo, $){
	
	var GeoModule = {
		
		init:function(){
		
			var geoinfo = new Geoinfo({
				container : $("div#dynamic_area"),
				data: ["CN"]
			});
			geoinfo.on("change",function(data){
				var selectedArea = "";
				for(var nameIndex in data.name){
					selectedArea += data.name[nameIndex] + "&nbsp";
				}
				$('div.selected-area').html(selectedArea);
			})
			
		}
	}
	
	return GeoModule;
});
