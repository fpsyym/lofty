define("lofty/lang/doc/context/simple/page",['fui/paging/1.0'], function(Paging){
	
  var pageModule = {
		
	//模块的入口函数
	init:function(){
		
		var self = this;
		var page = new Paging({
			container:'#dynamic_paging',
			onRender:function(page){
				self.otherFunc();
			}
		});
	}, 
		
	otherFunc:function(){
		// do something
	}	
  }
  return pageModule;
});

