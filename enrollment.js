$(document).ready(function() {
console.log("Hi, I'm John Muyskens. I'm an aspiring web designer.");
console.log("You can find my website over at jmuyskens.github.io");
    console.log("No bitmaps were harmed in the making of this website");
var muyColors =['#db402c','#396d72','#73af93','#af273d','#e97652','#ebb930','#395576','#67ccea','#babca7','#de8909','#066bdd','#0c4b3f'];

// cookie functions from http://www.quirksmode.org/js/cookies.html
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

var hasVisited = readCookie("visited");
var firstTimer = false;
    
// if this is your first time visiting the site, you get a splash screen
if (!hasVisited) {
    firstTimer = true;
	createCookie("visited",1,999); // and then never ever again for 999 days
    $("#showsplash").hide();
    $("#splashx").show();
	$("#splash").fadeToggle();

}

function reconfabulate(array, offs){
	while(offs > 0){
		array.push(array.shift());
		offs--;
	}
	return array;
}

var margin = {top: 20, right: 50, bottom: 30, left: 40},
	year = 2013,
	year0 = 2004,
	dataType = 'rel',
	offset = 0,
	dur = 1000,
	firstvalue = 0,
	total = 0,
    chimesclicks = 0;
    lock = false,
    lastArcSelected = 'none',
	pie = d3.layout.pie().sort(null).startAngle(0),
	piecolor = d3.scale.category20(),
	catSelector = {	"minorities":["masian","mhispanic","mblack","mtwoplus","mnative"],"gender":["female","male"],
					"cit":["us","cother","can","korea"],
					"rel":["crc","roprot","rnondenom","pres","rreform","rbaptist","rnone","cath","rother"],
					"major":["stem","socsci","humanities","edu","pe","lang","undecided","arts","idis"],
					"stem":["engr","nursing","bio","psych","chem","cs","math","geo","phys","ph"],
					"humanities":["cas","eng","history","phil","religion","classics"],
					"socsci":["business","soc","polisci","intldev","econ",],
                              "pre-prof":["pre-med","pre-law","pre-phys","pre-ass","pre-sem","pre-pharm","pre-occ","pre-arch","pre-dent","pre-opt"]},
	formTitle = {"male":"Male","female":"Female","korea":"South Korea","us":"United States","can":"Canada","cother":"other","crc":"CRC",
				"rreform":"Other Reformed","pres":"Presbyterian","roprot":"Other Protestant","cath":"Roman Catholic",
				"rother":"Other","rnone":"None/Not specified","art":"Art and Art History","asian":"Asian Studies",
				"bio":"Biology","business":"Business","chem":"Chem. & Biochem.","classics":"Classical Languages",
				"cas":"Comm. Arts","cs":"Computer Science","econ":"Economics","edu":"Education",
				"engr":"Engineering","eng":"English","french":"French","geo":"Geo. & Environ.","ph":"Public Health",
				"germ":"Germanic and Asian Languages","history":"History","idis":"Interdisciplinary","intldev":"Int'l Development",
				"pe":"Kinesiology","math":"Math & Stats","music":"Music","nursing":"Nursing","phil":"Philosophy",
				"phys":"Physics","polisci":"Political Science","psych":"Psychology","ph":"Public Health","religion":"Religion","soc":"Soc. & Social Work",
				"spanish":"Spanish","undecided":"Undecided","stem":"S.T.E.M.","socsci":"Social Sciences",
				"humanities":"Humanities","lang":"Foreign Languages",
				"arts":"Fine Arts",
                "rnondenom":"Nondenom.",
                              "rbaptist":"Baptist",
                "pre-arch":"Architecture","pre-law":"Law","pre-med":"Medicine","pre-occ":"Occup. Therapy","pre-opt":"Optometry","pre-pharm":"Pharmacy","pre-phys":"Physical Therapy","pre-ass":"Physician's Ass't","pre-sem":"Seminary","pre-dent":"Dentistry","mblack":"African American","mhispanic":"Hispanic","masian":"Asian American","mnative":"Native American","mpacific":"Native Hawaiian/Pacific Islander","mtwoplus":"Two or more"},
	//screenWidth = $(window).width(),
	//screenHeight = $(window).height(),
    screenWidth = 1210,
    screenHeight = 700,
    //height = Math.min(2 * screenHeight / 3 - margin.left - margin.right, 2 * screenHeight / 3 - margin.top - margin.bottom),
    height = 550 - margin.left - margin.right;
    //width = height * 1.5,
    totalBarsWidth = 420,
    width = 1100 - margin.left - margin.right;
	legendOffset = 120,
	pieWidth = 425,
	pieOffset = totalBarsWidth + legendOffset + pieWidth / 2,
	r = pieWidth / 2 - 25;
	innerR = r*.55;
	arc = d3.svg.arc().outerRadius(r).innerRadius(innerR)
	selectorArc = d3.svg.arc().outerRadius(innerR*0.95).innerRadius(innerR*0.9)
	name = catSelector[dataType][0]; // this selects the first data inside the donut chart
	
var x = d3.scale.ordinal()
    .rangeRoundBands([0, totalBarsWidth], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

//var color = d3.scale.category20c();
var color = d3.scale.ordinal().range(muyColors);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select("#wrap").append("svg")
    .attr("width", width)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("calvin-stats.csv", function(error, data) {


function currentSection(name) {  // this selects the data that will display in the donut chart
	var section = {};
	section.id = name;
	section.name = formTitle[name];
	section.number = getYear(year)[offset];
	total = data[year - year0].total
	section.percentage = section.number / total;
	return section;
}

section = currentSection(name); // this provides the initial data inside the donut chart
	
function computeData(){
	// calculate sums of majors grouped together
	data.forEach(function (d) {
		d.stem = +d.bio + +d.chem + +d.cs + +d.phys + +d.engr + +d.psych + +d.geo + +d.nursing + +d.math;
		d.humanities = +d.eng + +d.cas + +d.history + +d.phil + +d.classics + +d.religion;
		d.socsci = +d.polisci + +d.intldev + +d.econ + +d.business + +d.soc;
		d.arts = +d.music + +d.art;
		d.lang = +d.asian + +d.germ + +d.french + +d.spanish;
		d["pre-prof"] = +d["pre-arch"] + +d["pre-law"] + +d["pre-dent"] + +d["pre-med"] + +d["pre-occ"] + +d["pre-opt"] + +d["pre-pharm"] + +d["pre-phys"] + +d["pre-ass"] + +d["pre-sem"];		
	});

    firstvalue += offset;
  	color.domain(d3.keys(data[0]).filter(function(key) { 
        return catSelector[dataType].indexOf(key) > -1; 
    })); //is it in our selected array?

  	data.forEach(function(d) {
    	var y0 = 0;
    	
    	d.series = color.domain().map(function(name) { return {name: name, year:d.year}; });
    	
    	targetorder = catSelector[dataType];
    	d.series.sort(function(a, b) { return targetorder.indexOf(a.name) - targetorder.indexOf(b.name); })
	
        d.series.forEach(function(e) {
        	e.y0 = y0;
        	e.y1 = y0 += +d[e.name];
        });
        	
  	  	d.total = d.series[d.series.length - 1].y1;
  
	});
	
	//console.log(data);
	//data.sort(function(a, b) { return b.total - a.total; });

	x.domain(data.map(function(d) { return d.year; }));
	y.domain([0, d3.max(data, function(d) { return d.total; })]);
}

computeData();
  
svg.append("g")
  	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

var years = svg.selectAll(".year")
    .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { 
          return "translate(" + ( x (d.year) ) + ",0)"; 
      });

years
	.append("text")
	.text(function(d) { return d.total; })
	.attr("fill","white")
	.attr("text-anchor","middle")
	.attr("x", x.rangeBand() / 2)
	.attr("y", function(d) { 
        return y( d.total ) - 5; 
    });



var bars = years.selectAll(".year rect");

var piebase = svg.append("g")
	.attr("transform","translate("+(pieOffset)+","+(height - r)+")");

    
function updateBars(){
 	computeData();
 	
 	var trans = svg.transition().duration(dur);
 	trans.select(".y.axis").call(yAxis);
 	
	years = years.data(data);
	
	years
		.enter().append("g")
      	.attr("class", "g")
      	.attr("transform", function(d) { return "translate(" + x(d.year) + ",0)"; });
      	
	years.selectAll("text")
		.text(function(d) { return d.total; })
		.attr("y", function(d) { return y(d.total) - 5; })
        .attr("class","barLabels");
	
	years.exit().transition().duration(dur).attr("fill","white");
    
    bars = bars.data(function(d) { return d.series; });
  
   bars
    .enter().append("rect")
      .attr("width", x.rangeBand()+3)
      .attr("class", function(d) {return "clickable";})
    .style("fill", function(d) { return color(d.name); })
      .on("mouseover", function(d, i) {
          if (!lock) {
            d3.select(this)
                .transition()
                .duration(50)
                .style("fill",d3.rgb(d3.select(this).style("fill"))
                    .brighter(0.5));
              legendOut(d.name);
          } else {
               d3.select(this).style("fill",d3.rgb(d3.select(this).style("fill"))
                 .brighter(0.5));
          }
            
      	    year = d.year;
      	    offset = jQuery.inArray(d.name,catSelector[dataType]);
      	    section = currentSection(d.name);
      	    updateChart(offset);
      	  })
        .on("mouseout", function(d, i) {
            if (!lock) {
      	     d3.select(this)
                .transition()
                .duration(300)
                .style("fill", function(d) { 
                    return color(d.name); 
                });
                legendIn(d.name);
            } else {
               d3.select(this).style("fill", function(d) { 
                    return color(d.name); 
                });
            }
            
      	  })
        .on("click", function(d) { 
      		year = d.year;
      		offset = jQuery.inArray(d.name,catSelector[dataType]);
      		catSelector[dataType] = reconfabulate(catSelector[dataType],offset)
      		updateBars();
      		updateChart(offset); // the offset value, so we can rotate the pie chart
      	})
      //.transition().duration(dur).ease("elastic")
      .attr("y", height) //height
      .attr("height",0);
      
    
    bars
    	.transition().each("start", function() { lock = true; }).duration(dur).ease("elastic")
    	.style("fill", function(d) { return color(d.name); })
    	.attr("y", function(d) { return y(d.y1); })
        .attr("height", function(d) { return y(d.y0) - y(d.y1); })
        .each("end", function() { lock = false; });

        
    
 	bars.exit().attr("y", height).attr("height",0).remove();
	
	years.select("text").transition().duration(dur).attr("fill", "black");
     
    /***************************************************
    * legend-ary
    *******************************************************/
    
	var textlegend = svg.selectAll(".textlegend")
		.data(data[0].series.reverse(), function(d) { return d.name; })
        .on("mouseover", function(d) {
      	    offset = jQuery.inArray(d.name,catSelector[dataType]);
      	    section = currentSection(d.name);
      	    updateChart(offset);
      	  })
    
        .on("click", function(d) { 
      		offset = jQuery.inArray(d.name,catSelector[dataType]);
      		catSelector[dataType] = reconfabulate(catSelector[dataType],offset)
      		updateBars();
      		updateChart(offset); // the offset value, so we can rotate the pie chart
      	});
		
	textlegend
		.enter().append("g")
		.attr("class", function(d) { return d.name + " textlegend clickable"; })
		.attr("transform", function(d, i) { 
            return "translate("+ totalBarsWidth + "," + i * 20 + ")"; 
        })
        .append("text")
        .attr("class", function(d) { return d.name + " clickable"; })
      	.attr("x", 23)
      	.attr("y", 9)
      	.attr("dy", ".35em")
      	.style("text-anchor", "beginning")
      	.text(function(d) { return formTitle[d.name] + '\u00A0'; })
        .on("mouseover", function(d,i) {
      	    offset = jQuery.inArray(d.name,catSelector[dataType]);
      	    section = currentSection(d.name);
            if (!lock) {
                legendOut(d.name);
            }
      	    updateChart(offset);
      	  })
    .on("click", function(d) { 
      		offset = jQuery.inArray(d.name,catSelector[dataType]);
      		catSelector[dataType] = reconfabulate(catSelector[dataType],offset)
      		updateBars();
      		updateChart(offset); // the offset value, so we can rotate the pie chart
      	}).on("mouseout", function(d, i) {
      	    
            if (!lock) {
                legendIn(d.name);
            }
      	  });
		
    textlegend
        .append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .attr("class", function(d) { return d.name + " clickable"; })
        .style("fill", function(d) { return color(d.name);})
        .on("mouseover", function(d,i) {
      	    offset = jQuery.inArray(d.name,catSelector[dataType]);
      	    section = currentSection(d.name);
            if (!lock) {
                legendOut(d.name);
            }
      	    updateChart(offset);
      	  })
        .on("click", function(d) { 
      		offset = jQuery.inArray(d.name,catSelector[dataType]);
      		catSelector[dataType] = reconfabulate(catSelector[dataType],offset)
      		updateBars();
      		updateChart(offset); // the offset value, so we can rotate the pie chart
      	})
        .on("mouseout", function(d, i) {
            if (!lock) {
                legendIn(d.name);
            }
      	  });
    
    textlegend
        .transition()
        .duration(dur)
        //.delay(function(d,i) { return ((i + offset) % data[0].series.length) * 50; })
        .attr("transform", function(d, i) { 
            return "translate( " + totalBarsWidth + "," + i * 20 + ")"; 
        });

      	
    textlegend.exit().remove();

}

updateBars();

function legendOut (name) {
    d3.select('.' + name)
            .transition()
            .duration(300)
            .ease('elastic')
            .attr("transform", function() { 
                return "translate("+ 425 + "," + (catSelector[dataType].length - jQuery.inArray(name, catSelector[dataType]) - 1) * 20 + ")"; 
            });
}
    
function legendIn (name) {
     d3.select('.' + name)
                .transition().duration(300)
                .attr("transform", function() { 
                    return "translate("+ 420 + "," + (catSelector[dataType].length - jQuery.inArray(name,catSelector[dataType]) - 1) * 20 + ")"; 
                });
}
    
function getYear(year) {
		
	var list = [];
		
	for (var i = 0; i < catSelector[dataType].length; i++) 
	{
			
		list[i] = data[year - year0][catSelector[dataType][i]];
		//list[i].name = catSelector[dataType][i];
	}
	return list;
}
	
	
function arcTween(a) {
	var i = d3.interpolate(this._current, a);
	this._current = i(0);
	return function(t) {
    	return arc(i(t));
 	};
}

function selectorArcTween(a) {
	var i = d3.interpolate(this._current, a);
	this._current = i(0);
	return function(t) {
    	return selectorArc(i(t));
 	};
}

// some code from https://groups.google.com/forum/#!msg/d3-js/l0hbBdy9NcM/yqlIhPvd68kJ
var finishAngle = 0; // where the selected slice will rotate to

var curKey = function(myVal) { 
        var privateString = ''; 
        function changeBy(val) { 
                privateString = val; 
        } 
        return { 
                chg: function(Val) { 
                        changeBy(Val); 
                }, 
                value: function() { 
                        return privateString; 
                } 
        }}

var angTrans=curKey(); 

function swap(d,i) { 
        var angTr= finishAngle - d.startAngle; 
        if ((d.endAngle +d.startAngle)/2>(Math.PI*3/2) ) angTr=2*Math.PI- 
((d.endAngle +d.startAngle)/2)+Math.PI/2; 
        angTrans.chg(angTr); 
  d3.selectAll("path.piechart") 
      .each(transitionRotatealone);
} 

function transitionRotatealone(d, i) { 
  var a0 = d.startAngle + d.endAngle + 2*angTrans.value(), 
      a1 = d.startAngle - d.endAngle; 
  d3.select(this) 
    .transition().duration(1000).ease("bounce") 
      .attrTween("d", tweenArc({ 
        startAngle: (a0 + a1) / 2, 
        endAngle: (a0 - a1) / 2 
      })); 
} 

function tweenArc(b) {
  return function(a) {
    console.log(a);
    var i = d3.interpolate(a, b); 
    for (var key in b) a[key] = b[key]; // update data 
    return function(t) { 
      return arc(i(t)); 
    }; 
  }; 
} 

var arcs = piebase.selectAll(".piechart path")
	.data(pie(getYear(year)))
	.enter().append("svg:path")
	.attr("class","piechart clickable")
	.attr("fill", function(d, i) { return piecolor(i); })
	.attr("d", arc)
	.attr("fill", function(d, i) { return color(catSelector[dataType][i]); })
	.each(function(d) { this._current = d;});
	
var selectorArcs = piebase.selectAll(".pieselector path")
	.data(pie(getYear(year)))
	.enter().append("svg:path")
	.attr("class","pieselector")
	.attr("d", selectorArc)
	.attr("fill", function(d, i) { return (i == offset) ? color(catSelector[dataType][i]) : "#ffffff"; })
    .attr("class", function(d, i) { currName = catSelector[dataType][i]; 
		    return (section.id == currName) ? "pieSelector" : "pieSelector nonHighlight"; })
	.each(function(d) { this._current = d;});

// adds a year label above the pie chart	
piebase.append("text")
	.attr("class","pieYearLabel")
	.text(year)
	.attr("text-anchor","middle")
	.style("font-size", "42px")
	.attr("y", -r*1.1);

// label for the percentage of the selected section w/r/t the whole inside the pie chart
piebase.append("text")
	.attr("class","pieSectionLabelNumber")
	.attr("text-anchor","middle")
	.attr("dy", ".35em")
	.style("font-size", "50px")
	.style("font-weight", "800")
	    .style("font-style", "italic")
	.attr("fill", function() { return color(section.id); })
	.text(Math.round(section.percentage * 100) + "%");

// label for the name of selected section inside the pie chart
piebase.append("text")
	.attr("class","pieSectionLabel")
	.attr("text-anchor","middle")
	.attr("y", innerR*0.4)
	.style("font-size", "19px")
	.attr("fill", function() { return color(section.id); })
	.text(section.name);

// label for number of the population of the selected section inside the pie chart
piebase.append("text")
	.attr("class","pieNumberLabel")
	.attr("text-anchor","middle")
	.attr("y", innerR*-0.3)
	.style("font-size", "18px")
	.attr("fill", function() { return color(section.id); })
	.text(section.number);


function enableArcInteractivity() {
arcs.on("click", function(d, i) { 
      	offset = i;
      	catSelector[dataType] = reconfabulate(catSelector[dataType],offset)
      	console.log(catSelector[dataType]);
      	updateBars();
      	updateChart(offset); // the offset value, so we can rotate the pie chart
    });

arcs.on("mouseout", function (d) {
   legendIn(section.id); 
});
    
arcs.on("mouseover", function(d, i) {
    
    offset = i;
    
	section = currentSection(catSelector[dataType][i]);
    
    
    legendIn(lastArcSelected);
    legendOut(section.id);
    lastArcSelected = section.id;
    console.log(section.id);
	updateChart();
	});	
}
enableArcInteractivity();
	
function updateChart(offset) { // handles pie chart transitions
		
	offset += offset || 0;
		
	piedata = getYear(year);
		
	arcs = arcs.data(pie(piedata));
	selectorArcs = selectorArcs.data(pie(piedata));

	arcs.enter().append("svg:path")
		.each(function(d) { this._current = d;});
	
	selectorArcs.enter().append("svg:path")
		.each(function(d) { this._current = d;});

	
	arcs.
	    transition().
	    duration(dur).
	    ease("elastic").
	    attrTween("d", arcTween).
	    attr("fill", function(d, i) { 
	        return color(catSelector[dataType][i]); });
	
	selectorArcs.
	    transition().
	    duration(dur).
	    ease("elastic").
	    attrTween("d", selectorArcTween);
	
	selectorArcs
		.attr("fill", function(d, i) { currName = catSelector[dataType][i]; 
		    return (section.id == currName) ? color(currName) : "#ffffff"; })
        .attr("class", function(d, i) { currName = catSelector[dataType][i]; 
		    return (section.id == currName) ? "pieSelector" : "pieSelector nonHighlight"; });
	
	arcs.exit().remove();
	
	selectorArcs.exit().remove();
	enableArcInteractivity();
	piebase.select(".pieYearLabel")
		.text(year);
	piebase.select(".pieSectionLabel")
		.text(section.name)
		.attr("fill", function() { return color(section.id); });
	piebase.select(".pieNumberLabel")
		.text(section.number)
		.attr("fill", function() { return color(section.id); });
	piebase.select(".pieSectionLabelNumber")
		.text(Math.round(section.percentage * 100) + "%")
		.attr("fill", function() { return color(section.id); });
	
}
/*	
$("#splashButton").click( function() {
    $("#splash").fadeToggle(); 
    $('#showsplash').fadeToggle();
    $('#splashx').fadeToggle();
});
*/
$('#showsplash').click(function() {
    $("#splash").fadeToggle();
    $('#splashx').fadeToggle();
    $('#showsplash').fadeToggle();
    $("#splash").css("display","table");
});

$('#help').click(function() {
    $("#splash").fadeToggle();
    $('#splashx').fadeToggle();
    $('#showsplash').fadeToggle();
    $("#splash").css("display","table");
});
    
$('#splashx').click(function() {
    $('#splash').fadeToggle();
    $('#splashx').fadeToggle();
    $('#showsplash').fadeToggle();
    if (firstTimer) {
        $('#help').fadeToggle().delay(5000).fadeToggle();
        firstTimer = false;
    }
});
    
$('#splash').click(function() {
    $('#splash').fadeToggle();
    $('#splashx').fadeToggle();
    $('#showsplash').fadeToggle();
    if (firstTimer) {
        $('#help').fadeToggle();
        firstTimer = false;
    }
});


$('#religion').click(function() {
    offset = 0;
	dataType = 'rel';
	computeData();
	updateBars();
    section = currentSection(catSelector[dataType][0]);
	updateChart();
	$('.option').removeClass("highlighted");
	$('#religion').addClass("highlighted");
	$('#submenu').slideUp();
	});
$('#major').click(function() {
    offset = 0;
	dataType = 'major';
	computeData();
	updateBars();
    section = currentSection(catSelector[dataType][0]);
	updateChart();
	$('.option').removeClass("highlighted");
	$('#major').addClass("highlighted");
	$('#allmajor').addClass("highlighted");
	$('#submenu').slideDown();
	});
$('#allmajor').click(function() {
    offset = 0;
	dataType = 'major';
	computeData();
	updateBars();
    section = currentSection(catSelector[dataType][0]);
	updateChart();
	$('#submenu').css("display:inline");
	$('.sub').removeClass("highlighted");
	$('#allmajor').addClass("highlighted");
	});
$('#stem').click(function() {
    offset = 0;
	dataType = 'stem';
	computeData();
	updateBars();
    section = currentSection(catSelector[dataType][0]);
	updateChart();
	$('.sub').removeClass("highlighted");
	$('#stem').addClass("highlighted");
	});
$('#socsci').click(function() {
    offset = 0;
	dataType = 'socsci';
	computeData();
	updateBars();
    section = currentSection(catSelector[dataType][0]);
	updateChart();
	$('.sub').removeClass("highlighted");
	$('#socsci').addClass("highlighted");
	});
$('#humanities').click(function() {
    offset = 0;
	dataType = 'humanities';
	computeData();
	updateBars();
    section = currentSection(catSelector[dataType][0]);
	updateChart();
	$('.sub').removeClass("highlighted");
	$('#humanities').addClass("highlighted");
	});
$('#pre-prof').click(function() {
    offset = 0;
	dataType = 'pre-prof';
	computeData();
	updateBars();
    section = currentSection(catSelector[dataType][0]);
	updateChart();
	$('.sub').removeClass("highlighted");
	$('#pre-prof').addClass("highlighted");
	});
$('#gender').click(function() {
    offset = 0;
	dataType = 'gender';
	computeData();
	updateBars();
    section = currentSection(catSelector[dataType][0]);
	updateChart();
	$('.option').removeClass("highlighted");
	$('#gender').addClass("highlighted");
	$('#submenu').slideUp();
	});
$('#citizenship').click(function() {
    offset = 0;
	dataType = 'cit';
	computeData();
	updateBars();
    section = currentSection(catSelector[dataType][0]);
	updateChart();
	$('.option').removeClass("highlighted");
	$('#citizenship').addClass("highlighted");
	$('#submenu').slideUp();
	});
$('#minorities').click(function() {
    offset = 0;
	dataType = 'minorities';
	computeData();
	updateBars();
    section = currentSection(catSelector[dataType][0]);
	updateChart();
	$('.option').removeClass("highlighted");
	$('#minorities').addClass("highlighted");
	$('#submenu').slideUp();
	});
	
$('#prelude').click(function() {
    chimesclicks++;
    if (chimesclicks == 7)
        notAnEasterEgg();
});
});
});

function notAnEasterEgg() {
    var width, top, right, opacity;
    var date = new Date();
    var num = +date.getFullYear() - 1907;
    console.log(date.getFullYear());
    for (var i = 0; i < date.getFullYear() - 1907; i++) {
        width = Math.random() * (500 - 10) + 10;
        top = Math.random() * 500;
        right = Math.random() * 1500;
        opacity = Math.random() * 0.5;
        $("<img id='eastereggchimeslogo' style='display:none; top: " + top +"; right:" + right + "px; width:" + width + "; opacity:" + opacity + "' src='logo.svg'>").appendTo('body').delay(Math.random() * 3000).fadeIn();
        
    }
    $("<img style='position:absolute; width:0px; right: 500px; top: 100px; left: 500px' src='claw.svg'>").appendTo('body').delay(1000).animate({width: "500px"}, 'slow');
}