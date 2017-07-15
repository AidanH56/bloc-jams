 /*var pointsArray = document.getElementsByClassName('point');

   var revealPoint = function(point) {
                    point.style.opacity = 1;
                    point.style.transform = "scaleX(1) translateY(0)";
                    point.style.msTransform = "scaleX(1) translateY(0)";
                    point.style.WebkitTransform = "scaleX(1) translateY(0)";
                 }
 
 var animatePoints = function(points) {

    forEach(points,revealPoint);

};

window.onload = function() {

    if (window.innerHeight > 950) {
         animatePoints(pointsArray);
     }

     window.addEventListener("scroll", function(event) {
         if (pointsArray[0].getBoundingClientRect().top <= 500) {
             animatePoints(pointsArray);   
         }
     });
 }*/
 
 var animatePoints = function() {
    var revealPoint = function() {
         
         $(this).css({
             opacity: 1,
             transform: 'scaleX(1) translateY(0)'
         });
    };
    $.each($('.point'), revealPoint);
 };

 $(window).load(function() {
    if ($(window).height() > 950) {
         animatePoints();
     }

    var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;

    $(window).scroll(function(event) {
         if ($(window).scrollTop() >= scrollDistance) {
             animatePoints(); 
         }
    });
 });