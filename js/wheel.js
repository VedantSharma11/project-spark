



var padding = {top:20, right:40, bottom:0, left:0},
w = 500 - padding.left - padding.right,
h = 500 - padding.top  - padding.bottom,
r = Math.min(w, h)/2,
rotation = 0,
oldrotation = 0,
picked = 100000,
oldpick = [],
color = d3.scale.category20();//category20c()
//randomNumbers = getRandomNumbers();
//http://osric.com/bingo-card-generator/?title=HTML+and+CSS+BINGO!&words=padding%2Cfont-family%2Ccolor%2Cfont-weight%2Cfont-size%2Cbackground-color%2Cnesting%2Cbottom%2Csans-serif%2Cperiod%2Cpound+sign%2C%EF%B9%A4body%EF%B9%A5%2C%EF%B9%A4ul%EF%B9%A5%2C%EF%B9%A4h1%EF%B9%A5%2Cmargin%2C%3C++%3E%2C{+}%2C%EF%B9%A4p%EF%B9%A5%2C%EF%B9%A4!DOCTYPE+html%EF%B9%A5%2C%EF%B9%A4head%EF%B9%A5%2Ccolon%2C%EF%B9%A4style%EF%B9%A5%2C.html%2CHTML%2CCSS%2CJavaScript%2Cborder&freespace=true&freespaceValue=Web+Design+Master&freespaceRandom=false&width=5&height=5&number=35#results
var data = [
        {"label":"The Evergreen",  "value":1,  "question":" Drink plenty of water ", "desc":" Knowing more about your body's need for fluids will help you estimate how much water to drink each day." }, // padding
       
        {"label":" Pandemic made us LAZIER",  "value":2,  "question":"  Move more, sit less " ,"desc":"Some activity is better than none. The fates have guided you to Break Up With Your Chair!"}, //font-family
       
        {"label":"Never goes out of style",  "value":3,  "question":"Volunteer more often ", "desc":"volunteering is a good start to finding an opportunity that's right for you."}, //color
       
        {"label":"It is the magic word",  "value":4,  "question":" Adopt an attitude of gratitude ","desc":"An attitude of gratitude means making it a conscious habit to express thankfulness and appreciation for every part of your life. "}, //font-weight
       
        {"label":"Goodbye sleeping beauty!",  "value":5,  "question":" Pick a time to wake up & stick to it!","desc":" Whenever you wake up will already be the best time to start your day. But consistency is the key! " }, //font-size
       
        {"label":"Be the Belle <3",  "value":6,  "question":" Develop a skincare routine ","desc":"Invest in your skin. It is going to represent you for a very long time. - Linden Tyler. "}, //background-color  
       
        {"label":"Rags to Riches",  "value":7,  "question":"Live simply, consume less ","desc":"How to decide what you really need, and only buy what you need, in a way so you don’t miss a thing, always look great, have no worries, and are definitely not in debt? "}, //nesting
        {"label":"Yummy yummy in my tummy!",  "value":8,  "question":"Be consistent with meal times ","desc":"Keep a consistent eating schedule as much as possible so that your body knows when to expect breakfast, lunch and dinner"}, //bottom
        {"label":"The Perfectionist",  "value":9,  "question":"Perfect one recipe ","desc":"The first time you make something, follow the recipe, then figure out how to tailor it to your own tastes. "}, //sans-serif
        {"label":"The Ditcher", "value":10, "question":"Ditch one bad habit ","desc":"Breaking unwanted habits can be difficult, especially if you’ve been engaging in them for a long time. But understanding how habits form in the first place can ease the process. "}
];


var svg = d3.select('#chart')
.append("svg")
.data([data])
.attr("width",  w + padding.left + padding.right)
.attr("height", h + padding.top + padding.bottom);
var container = svg.append("g")
.attr("class", "chartholder")
.attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");
var vis = container
.append("g");

var pie = d3.layout.pie().sort(null).value(function(d){return 1;});
// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);
// select paths, use arc generator to draw
var arcs = vis.selectAll("g.slice")
.data(pie)
.enter()
.append("g")
.attr("class", "slice");

arcs.append("path")
.attr("fill", function(d, i){ return color(i); })
.attr("d", function (d) { return arc(d); });
// add the text
arcs.append("text").attr("transform", function(d){
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle)/2;
    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
})
.attr("text-anchor", "end")
.text( function(d, i) {
    return data[i].label;
});
container.on("click", spin);
function spin(d){

container.on("click", null);
//all slices have been seen, all done
console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
if(oldpick.length == data.length){
    console.log("done");
    container.on("click", null);
    return;
}
var  ps       = 360/data.length,
     pieslice = Math.round(1440/data.length),
     rng      = Math.floor((Math.random() * 1440) + 360);
    
rotation = (Math.round(rng / ps) * ps);

picked = Math.round(data.length - (rotation % 360)/ps);
picked = picked >= data.length ? (picked % data.length) : picked;
if(oldpick.indexOf(picked) !== -1){
    d3.select(this).call(spin);
    return;
} else {
    oldpick.push(picked);
}
rotation += 90 - Math.round(ps/2);
vis.transition()
    .duration(3000)
    .attrTween("transform", rotTween)
    .each("end", function(){
        //mark question as seen
        d3.select(".slice:nth-child(" + (picked + 1) + ") path")
            .attr("fill", "lavenderblush");
        //populate question
        d3.select("#question h1")
            .text(data[picked].question);
        oldrotation = rotation;

        d3.select("#desc h3")
            .text(data[picked].desc);
        oldrotation = rotation;
  
        /* Get the result value from object "data" */
        console.log(data[picked].value)
  
        /* Comment the below line for restrict spin to sngle time */
        container.on("click", spin);
    });
}
//make arrow
svg.append("g")
.attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
.append("path")
.attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
.style({"fill":"orangered"});
//draw spin circle
container.append("circle")
.attr("cx", 0)
.attr("cy", 0)
.attr("r", 60)
.style({"fill":"white","cursor":"pointer"});
//spin text
container.append("text")
.attr("x", 0)
.attr("y", 15)
.attr("text-anchor", "middle")
.text("SPIN")
.style({"font-weight":"bold", "font-size":"30px"});


function rotTween(to) {
var i = d3.interpolate(oldrotation % 360, rotation);
return function(t) {
return "rotate(" + i(t) + ")";
};
}


function getRandomNumbers(){
var array = new Uint16Array(1000);
var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
    window.crypto.getRandomValues(array);
    console.log("works");
} else {
    //no support for crypto, get crappy random numbers
    for(var i=0; i < 1000; i++){
        array[i] = Math.floor(Math.random() * 100000) + 1;
    }
}
return array;




}
