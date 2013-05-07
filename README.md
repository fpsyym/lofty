# documentation

fangdeng.org

    club.fangdeng.org
    weekly.fangdeng.org

    work.fangdeng.org
    
    wiki.fangdeng.org
    
    lib.fangdeng.org
        fdev4
        fdev3
        
        lofty.fangdeng.org
            docs
            api
        

# classify


lofty/kernel 核心模块

lofty/port 核心出口文件

lofty/alicn 中文站专用模块

    web-alitalk
    web-addons
    util-cookie
    web-suggestion
    
lofty/adapter 适配fdev4专用模块

lofty/ecma 语言相关，deferred,callbacks,observer

    util-date
    util-json
    web-websocket
    
lofty/device 设备相关，浏览器，鼠标，键盘，屏幕，and etc.

    ui-mouse
    util-histroy 浏览器历史
    web-browser
    util-storage

lofty/dhtml 

    ui-draggable 拖动
    ui-droppable 拖放
    ui-portlets 模块排序
    ui-sortable 排序
    ui-tabs 切换
    ui-scrollto 平滑滚动
    ui-position 定位
    
avid 三方库

    web-sweet 模板语言


其他待定

    ui-autocomplete
    ui-colorbox 取色盒
    ui-combobox 模拟下拉
    ui-datepicker 日历
    ui-dialog 浮层
    ui-progressbar 进度条
    ui-timer 计时器


    web-stylesheet
    web-dataLazyload



    web-pca 省市区三级联动
    web-valid 验证


    util-debug del



#pre

1. src、doc、ut同步进行
1. 文档可以外网访问，http://lib.fangdeng.org/ http://5.lib.fangdeng.org/ http://fdev5.fangdeng.org/
1. alicn

#模块分级

lang -> unit -> zone -> mod -> region -> grid -> layout -> district -> layer

# lang

1. domready.js del
1. 常用函数：extendIf、substitute etc.

1. exposure.js 曝光 去掉one
1. observer.js 观察者 不提供全局
1. class.js 类     ok  必须写new

1. mvc.js MVC 改个名字

1. log.js 日志打印，由各应用框架按需扩展

1. module.js/widget.js    初稿
1. context.js   模块上下文处理

1. cookie.js



# 考虑

1. 如果有节点的时候， 入参只两个，首为节点，次为options

