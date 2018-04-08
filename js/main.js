$(function() {
    var canvas = new fabric.Canvas('smartAdCanvas');
    var nativeCanvas = document.getElementById('smartAdCanvas');
    //初始化颜色选择器
    $('#picker').colpick({
        layout: 'hex',
        submit: 0,
        colorScheme: 'dark',
        onChange: function (hsb, hex, rgb, el, bySetColor) {
            $(el).css('border-color', '#' + hex);
            // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
            if (!bySetColor) $(el).val(hex);
            console.log('color is: ', this.value);
        }
    }).keyup(function () {
        $(this).colpickSetColor(this.value);
        console.log('color is:', this.value)
    });
    // //add rect.
    // var rect = new fabric.Rect({
    //     top: 100,
    //     left: 100,
    //     width: 60,
    //     height: 70,
    //     fill: 'red'
    // });
    // //add circle.
    // var circle = new fabric.Circle({
    //     radius: 20,
    //     fill: 'green',
    //     left: 300,
    //     top: 300,
    // })
    // canvas.add(rect, circle);
    // //add images.
    // fabric.Image.fromURL('../images/girl.jpg', function(oImg) {
    //     // oImg.scale(0.5).set('flipX', true);
    //     oImg.scale(0.3)
    //         .set({
    //         left: 400,
    //         top: 400
    //         });
    //     canvas.add(oImg);
    // });
    // //add text.
    // var text = new fabric.IText('hello world', {
    //     left: 200,
    //     top: 50
    // });
    // canvas.add(text);
    // //customization.
    // canvas.item(0).set({
    //     borderColor: 'gray',
    //     cornerColor: 'black',
    //     cornerSize: 12,
    //     transparentCorners: true
    // });
    // canvas.backgroundColor = 'rgb(220,220,220)';
    // //interaction.
    // canvas.on('mouse:down', function(options) {
    //     console.log(options.e.clientX, options.e.clientY);
    // });
    // rect.on('selected', function(){
    //     console.log('selected a rectangle');
    // });
    // circle.on('selected', function() {
    //     console.log('selected a circle');
    // });
    // canvas.on('after:render', function() {
    //     canvas.forEachObject(function(obj) {
    //         var bound = obj.getBoundingRect();
    //         console.log('left: ' + bound.left + ' top: '+ bound.top);
    //     });
    // });

    //add event listens.
    //左侧功能栏切换
    $('#nav-wrapper a').on('click', function(e) {
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        var toolBarId = $(this).attr('data-target');
        $('div#toolbar').children('.toolbar').hide();
        $('div#toolbar').find('div#' + toolBarId).show();
    });
    //右侧panel 展开控制
    $('#panel-show-hide-btn').on('click', function(e) {
        if($('#panel').hasClass('show')){
            $('#panel').removeClass('show');
        } else {
            $('#panel').addClass('show');
        }
    });

    //事件委托处理动态添加dom
    $('div.upload-list').on('mouseover', '.upload-item', function(e) {
        //图片鼠标滑过效果    
        $(this).find('.upload-item-cover').show();
    });
    $('div.upload-list').on('mouseleave', '.upload-item', function(e) {
        //图片鼠标滑过效果    
        $(this).find('.upload-item-cover').hide();
    });    
    $('div.upload-list').on('click', '.upload-item-delete', function(e) {
        //删除预览图片  
        $(this).parents('div.upload-item').remove();
        e.stopPropagation();
    });     
    $('div.upload-list').on('click', '.upload-item', function(e) {
        //点击之后添加到中间canvas画布
        //居中功能 tbd.
        var imgElement = $(this).find('img')[1];
        var imgInstance = new fabric.Image(imgElement, {
            left: 100,
            top: 100,
        });
        imgInstance.scale(0.3);
        canvas.add(imgInstance);        
    });

    //打开图片文件
    $('div.add-btn').on('click', function(e) {
        $('#editorFileInput').trigger('click');
    });
    $('a#header-toolbar-openFile').on('click', function(e) {
        e && e.preventDefault();
        $('#editorFileInput').trigger('click');
    });
    //input file 选择了图片
    $('#editorFileInput').on('change', function(e) {
        var imgFile = this.files[0];
        var fileReader = new FileReader();
        fileReader.readAsDataURL(imgFile);
        fileReader.onload = function(e) {
            var imgSrc = e.target.result;
            //右侧预览区域显示
            var previewHtml = [
                '<div class="upload-item">',
                    '<div class="upload-item-img">',
                        '<img src="' + imgSrc + '" width="100%">',
                        '<img src="' + imgSrc + '" style="display:none">',
                    '</div>',
                    '<div class="upload-item-cover"><div class="upload-item-delete"></div></div>',
                '</div>'
            ].join('');                  
            $('div.upload-list').append(previewHtml);
            // imagesAddEvents();
        }
    });
    //删除选中对象
    $('a#header-toolbar-delete').on('click', function(e) {
        e && e.preventDefault();
        if(canvas && canvas.getActiveObject()) {
            var activeObj = canvas.getActiveObject();
            canvas.remove(activeObj);
        }
    });
    //删除所有图片
    $('a#trash-box').on('click', function(e) {
        e && e.preventDefault();
        $('div.upload-list').empty();
    });

    //保存canvas图片 
    $('a#header-toolbar-save').on('click', function(e) {
        var fileName = '智能广告_' + (new Date()).getTime();
        //这里宽高直接取nativeCanvas属性会出现下载失败，感觉是fabric添加的元素宽高有关
        Canvas2Image.saveAsPNG(nativeCanvas, 1090, 811, fileName);
    });     

    //添加文字
    $('div.toolbar-list p#addTextToCanvas span').on('click', function(e) {
        //add text.
        var txt = $('input#typeText').val();
        var fontSize = $('input#fontSize').val();
        var color = '#' + $('input#picker').val();
        var text = new fabric.IText(txt, {
            left: 200,
            top: 50,
            fontSize: fontSize,
            stroke: color
        });
        canvas.add(text);
    });
})