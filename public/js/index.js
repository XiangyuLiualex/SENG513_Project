function loadbox(){
    //resize the picture with window size(mobile friendly)
    let length;
    if(innerWidth>innerHeight){
        length=innerHeight/2;
    }else{
        length=innerWidth/2;
    }
    console.log("length: "+length)
    console.log("I am here")
    $(".box").css("width",length);
    $(".box").css("height",length*0.75);
    // $('.box').css({

    //     'margin-top':-$('.box').outerHeight(true)/2+'px',//获取总高/2
        
    //     'margin-left':-$('.box').outerWidth(true)/2+'px' //获取总宽/2
        
    //     });
}