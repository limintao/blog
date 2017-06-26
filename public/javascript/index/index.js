document.body.onfocus = function(){
    document.title = "首页";
};
document.body.onblur = function(){
    document.title = 'i miss you';
};


let time = new Date();

console.log(time)

$(function () {

    console.log(parseInt($(".media-right").children("span").text()) );
});

