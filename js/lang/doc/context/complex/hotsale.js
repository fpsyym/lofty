define("lofty/lang/doc/context/complex/hotsale", ['jquery','fui/tabs/1.0','util/datalazyload/1.0','util/misc/1.0'], function($,Tabs,Datalazyload,util){
	
	
	var saleModule = {
		
		init:function(){
		
			requestCategory();
			requestOffer();
			docReady = true;
			createCategoryArea();
			createOfferArea();
			registTracelogEvt();
			registClickPotEvt();
			registLayerEvt();
		}
	}
	
	var docReady = false,
	    categoryDataReady = false,
		offerDataReady = false,
		user_id = 'xxx',
		page_id = '79001dc7698001821a2b8001381976991',
		offerObjectIds =[];
		//tab的个数
		var tabsCount;
		
	//常量
	var ctr_type = '85',
		offer_page_area = '1182',
		offer_object_type = 'offer',
		category_page_area = '4128',
		category_object_type = 'category',
		category_ctr_ns = 's.1688.com/selloffer/offer_search.htm';
	
	var categoryData,offerData;
	//请求类目的数据
	var cateRequestTimeoutId,offerRequestTimeoutId;
	
	function requestCategory(){
		$.ajax({
			url:'http://res.1688.com/fly/irecom.do?uid=' + user_id + '&pageid=' + page_id + '&recid=' + category_page_area,
			dataType:"jsonp",
			success:function(data){
				clearTimeout(cateRequestTimeoutId);
				categoryData = data;
				categoryDataReady = true;
				createCategoryArea();
			}
		});
		cateRequestTimeoutId = setTimeout(requestCategory,5000);
	}
	function requestOffer(){
		//请求offer的数据
		$.ajax({
			url:'http://res.1688.com/fly/irecom.do?uid=' + user_id + '&pageid=' + page_id + '&recid=' + offer_page_area,
			dataType:"jsonp",
			success:function(data){
				clearTimeout(offerRequestTimeoutId);
				offerData = data;
				offerDataReady = true;
				createOfferArea();
			}
		});
		offerRequestTimeoutId = setTimeout(requestOffer,5000);
	}
	
	function createCategoryArea(){
		if(!docReady || !categoryDataReady){
			return;
		}
		var cData = categoryData.data.data;
		var cateArr = [];
		var categoryObjectIds=[];
		for(var i=0,j=cData.length;i<j;i++){
			var cateItem = cData[i];
			
			categoryObjectIds.push(cateItem.categoryId);
			categoryObjectIds.push(',');
			categoryObjectIds.push(cateItem.alg);
			categoryObjectIds.push(';');
			
			cateArr.push('<li objectId="');
			cateArr.push(cateItem.categoryId);
			cateArr.push('" alg="');
			cateArr.push(cateItem.alg);
			cateArr.push('"><a href="');
			cateArr.push('http://s.1688.com/selloffer/offer_search.htm?keywords=' + cateItem.categoryDesc);
			cateArr.push('" target="_blank">');
			cateArr.push(util.escapeHTML(cateItem.categoryDesc));
			cateArr.push('</a></li>');
		}
		$('.hot-sale-container .left-area .title ul').html(cateArr.join(''));
		//曝光
		exposureEvt(
			ctr_type,
			category_page_area,
			category_page_area,
			page_id,
			category_object_type,
			categoryObjectIds.join(''),
			category_ctr_ns
		);
		
	}
	function createOfferArea(){
		if(!docReady || !offerDataReady){
			return;
		}
		var oData = offerData.data.data;
		var tabsContent = [];
		var tabsTitle = [];
		
		tabsCount = parseInt(oData.length/8,10);
		for(var i=0;i<tabsCount;i++){
			var tabOfferObjectIds = [];
			tabsContent.push('<div class="tab-b">');
			if(i > 0){
				tabsContent.push('<textarea class="lazyload-textarea">');
			}
			tabsContent.push('<ul>');
			for(var j=0;j<8;j++){
				var offerItem = oData[i*8+j];
				
				tabOfferObjectIds.push(offerItem.offerId);
				tabOfferObjectIds.push(',');
				tabOfferObjectIds.push(offerItem.alg);
				tabOfferObjectIds.push(';');
			
				tabsContent.push('<li objectId="');
				tabsContent.push(offerItem.offerId);
				tabsContent.push('" alg="');
				tabsContent.push(offerItem.alg);
				tabsContent.push('">');
				tabsContent.push('<div class="offer-img"><a href="');
				tabsContent.push(offerItem.offerDetailUrl);
				tabsContent.push('" target="_blank">');
				tabsContent.push('<img offer-name="');
				tabsContent.push(offerItem.subject);
				tabsContent.push('" src="');
				tabsContent.push(getImgUrl(offerItem.offerImageUrl));
				tabsContent.push('"></img></a></div>');
				
				tabsContent.push('<div class="price"><a href="');
				tabsContent.push(offerItem.offerDetailUrl);
				tabsContent.push('" target="_blank">');
				tabsContent.push(formatPrice(offerItem.rmbPrice));
				tabsContent.push('</a></div>');
				
				tabsContent.push('<div class="sales-volume">');
					if(offerItem.saleQuantity){
						tabsContent.push('<a href="');
						tabsContent.push(offerItem.offerDetailUrl);
						tabsContent.push('" target="_blank">已售出 <span class="num">');
						tabsContent.push(offerItem.saleQuantity);
						tabsContent.push('</span> ');
						tabsContent.push(offerItem.unit);
						tabsContent.push('</a>');
					}
				tabsContent.push('</div>');																				
				tabsContent.push('</li>');
			}
			offerObjectIds.push(tabOfferObjectIds.join(''));
			tabsContent.push('</ul>');
			if(i>0){
				tabsContent.push('</textarea>');
			}
			tabsContent.push('</div>');
		}
		if(tabsCount > 1){
			tabsTitle.push('<ul class="tabs-title-ul">');
			for(var i=0;i<tabsCount;i++){
				tabsTitle.push('<li class="tab-t"></li>');
			}
			tabsTitle.push('</ul>');
		}
		$('.offer-list-tabs .tabs-content').css('background','none').html(tabsContent.join(''));
		$('.offer-list-tabs .tabs-title').html(tabsTitle.join(''));
		//第一个tab曝光
		exposureEvt(
			ctr_type,
			offer_page_area,
			offer_page_area,
			page_id,
			offer_object_type,
			offerObjectIds[0],
			''
		);
		
		initTabs();
	}
	//tab排序用的打点
	function registTracelogEvt(){
		var tracelogContainer = $('[traceLogValue]');
		var tracelogValue = tracelogContainer.attr('traceLogValue') || '';
		
		tracelogContainer.on('mousedown','a',function(){
			var url = 'http://stat.1688.com/tracelog/click.html?tracelog='+tracelogValue+'&st_page_id=' + page_id;
			new Image(1,1).src = url;
		});
	}
	
	//曝光打点
	function exposureEvt(ctrType,pageArea,interfaceId,pageId,objectType,objectIds,ns){
		new Image(1,1).src = 'http://ctr.china.alibaba.com/ctr.html?ctr_type=' + ctrType + 
		                      '&page_area=' + pageArea + 
							  '&interface_id='+ interfaceId +
							  '&page_id='+pageId+
							  '&object_type='+objectType+
							  '&object_ids='+objectIds+
							  '&ctr_ns=' + ns;
	}
	
	//点击打点
	function registClickPotEvt(){
		//类目点击
		$('.left-area .title').on('mousedown','a',function(e){
			var $target = $(e.currentTarget).parent('li');
			clickMonite(
				ctr_type,
				category_page_area,
				category_object_type,
				$target.attr('objectId'),
				$target.attr('alg'),
				category_page_area,
				page_id,
				category_ctr_ns
			);
		});
		//offer点击
		$('.left-area .offer-list-tabs').on('mousedown','a',function(e){
			var $target = $(e.currentTarget);
			if(!$target.attr('objectId')){
				$target = $target.parents('li');
			}
			clickMonite(
				ctr_type,
				offer_page_area,
				offer_object_type,
				$target.attr('objectId'),
				$target.attr('alg'),
				offer_page_area,
				page_id,
				''
			);
		});
	}
	function clickMonite(ctrType,recId,objectType,objectId,alg,interfaceId,pageId,ns){
		new Image(1,1).src = 'http://stat.china.alibaba.com/bt/1688_click.html?page='+ctrType+ 
							  '&recId=' + recId  + 
							  '&objectType='+objectType+
							  '&objectId='+objectId+
							  '&alg='+alg+
							  '&interface_id='+interfaceId+
							  '&st_page_id='+pageId+
							  '&ctr_ns=' + ns;
	}
		
	function registLayerEvt(){
		//offer图片的浮层事件
		var layerEntered = false;
		var hideTimeoutId;
		$('.offer-list-tabs').on('mouseenter','.offer-img',function(e){
			if(hideTimeoutId){
				clearTimeout(hideTimeoutId);
			}
			var currentImg = $(e.currentTarget).find('a');
			var currentLi = $(e.currentTarget).parent('li');
			var offerName = currentImg.find('img').attr('offer-name');
			var imgOffset = currentImg.offset();
			$('.offer-float-layer').css({
				'top':imgOffset.top,
				'left':imgOffset.left,
				'display':'block'
			}).attr('href',currentImg.attr('href')
			).attr('objectId',currentLi.attr('objectId')
			).attr('alg',currentLi.attr('alg')
			).attr('title',offerName
			).find('div').html(offerName);
			
		}).on('mouseleave','.offer-img',function(){
			hideTimeoutId = setTimeout(function(){
				if(!layerEntered){
					$('.offer-float-layer').hide();
				}
			},0)
			
		}).on('mouseenter','.offer-float-layer',function(){
			layerEntered = true;
		}).on('mouseleave','.offer-float-layer',function(){
			layerEntered = false;
			var self = this;
			hideTimeoutId = setTimeout(function(){
				$(self).hide();
			},0)
			
		})
	}
	function initTabs(){
		if(tabsCount < 2){
			return;
		}
		var lazyArr = [];
		var tabIndex = 1;
		var tabIndexMap = {};
		$(".offer-list-tabs .tabs-content .tab-b").each(function(idx,item){
			if( idx > 0){
				tabIndexMap[tabIndex++]=true;
				var layArea = new Datalazyload({
									container:$(item),
									autoLoad:false
								});
				lazyArr.push(layArea);
				layArea.addCallBack("ul",function(){
					//曝光时打点
					exposureEvt(
						ctr_type,
						offer_page_area,
						offer_page_area,
						page_id,
						offer_object_type,
						offerObjectIds[idx],
						''
					)
				});
			}
				
		});
		
		var tab = new Tabs({
			tpl:'.offer-list-tabs',
			autoPlay:"line",
			currentCls: 'tab-current', 
			titleSelector: '.tab-t',    
			boxSelector: '.tab-b'    
		});
		tab.on('switch',function(data){
			if(!tabIndexMap[data.index]){
				return;
			}
			lazyArr[data.index-1].start();
			delete tabIndexMap[data.index];
		})
	}
	function getImgUrl(url){
		var patten = /\.jpg$/;
		if(patten.test(url)){
			url = url.substr(0,url.length-4);
		}
		return url + '.120x120.jpg';
	}
	function formatPrice(price){
		if(price < 10000){
			return price;
		}
		return Math.round((price/10000)*100)/100 + '万';
	}
	
	return saleModule;
});

