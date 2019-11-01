$(document).ready(function() {
  
  // handle tab clicking
  $('ul.tabs li').click(function(){
    var tab_id = $(this).attr('data-tab');

    $('ul.tabs li').removeClass('current');
    $('.tab-content').removeClass('current');

    $(this).addClass('current');
    $("#"+tab_id).addClass('current');
  })

  var data3 = [
    {"x": 4, "y": 4}, {"x": 3, "y": 4},
    {"x": 7, "y": 2}, {"x": 9, "y": 2}
  ];
  var ticks = [2, 4];
  var names = ["a", "b", "c", "d", "e"];

  var x = d3.scaleLinear()
    .domain([0,10])
    .range([0,340]);
  var xax = d3.axisBottom(x);

  var y = d3.scaleLinear()
    .domain([0,5])
    .range([340,0]);
  var yax = d3.axisLeft(y)
    .tickValues(ticks)
    .tickFormat(function(d,i) { return names[i]; });

  var vis3 = d3.select("#tab3chart")
    .append("svg")
      .attr("width", 400)
      .attr("height", 400)
    .append("g")
      .attr("transform", "translate(30,30)");

  // append axes to vis  
  vis3.append("g")
    .call(yax);
  vis3.append("g")
    .attr("transform", "translate(0," + 340 + ")")
    .call(xax);
    
  vis3.append("g")
    .selectAll("blabla")
    .data(data3)
    .enter()
    .append("circle")
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      .attr("r", 10)
      .style("fill", "blue");


  // ---------------------
  // LEAGUE AVERAGE CHART

  d3.csv("data/data.csv?_=" + Math.random(), function(data) {
    
    // ---------------
    // create dropdown

    // d3.select("#menu1")
    //   .selectAll("option")
    //   .data(d3.map(data, function(d) { return d.w; }).keys())
    //   .enter().append("option")
    //     .text(function(d) { return d; })
    //     .attr("value", function(d) { return d; });

    // https://codepen.io/arthurcamara1/pen/VpPMKz

    var minweek = d3.min(data, function(d) { return d.w; }),
        maxweek = d3.max(data, function(d) { return d.w; });

    console.log(maxweek);
    
    d3.select("#slider1")
      .attr("min", minweek)
      .attr("max", maxweek)
      .attr("step", 1)
      .attr("value", maxweek);

    // -----------
    // scatter viz

    var margin = {top: 30, right: 30, bottom: 30, left: 30},
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom,
        rad = 8;

    // Define the div for the tooltip
    var div = d3.select("body").append("div") 
      .attr("class", "tooltip")       
      .style("opacity", 0);

    // create x, y axes
    var x = d3.scaleLinear()
      .domain([0, 10])
      .range([0, width]);
    var y = d3.scaleLinear()
      .domain([0, 10])
      .range([height, 0]);  // y reversed

    // create main vis
    var vis = d3.select("#tab1chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
    // append axes to vis  
    vis.append("g")
      .call(d3.axisLeft(y));
    vis.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // color scale
    var colorScale = d3.scaleSequential(d3.interpolateRdBu)
      .domain([-10, 10]);

    // append scatter
    var gs = vis.append("g")
      .selectAll("g")
      .data(data.filter(function(d) { return d.w == maxweek}));

    var gsenter = gs.enter()
      .append("g")
      .on("mouseover", function(d) {
        // make full color
        d3.select(this)
          .selectAll("circle")
          .transition()
          .duration(200)
          .attr("r", rad+1)
          .style("opacity", 1.);

        d3.select(this)
          .selectAll("text")
          .transition()
          .duration(200)
          .style("fill", "black");
      })
      .on("mouseout", function(d) {
        // back to transparent
        d3.select(this)
          .selectAll("circle")
          .transition()
          .duration(200)
          .attr("r", rad)
          .style("opacity", 0.5);

        d3.select(this)
          .selectAll("text")
          .transition()
          .duration(200)
          .style("fill", "lightgray");
      });

    gsenter.append("circle")
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      .attr("r", rad)
      .style("fill", function(d) { return colorScale(d.x - d.y)})
      .style("opacity", 0.5);

    gsenter.append("text")
      .text(function(d) { return d.name; })
      .attr("x", function(d) { return x(d.x) + rad + 3; })
      .attr("y", function(d) { return y(d.y) + rad/2; })
      .style("fill", "lightgray");

    // append y=x line
    vis.append("line")
      .attr("x1", x(0))
      .attr("x2", x(10))
      .attr("y1", y(0))
      .attr("y2", y(10))
      .style("stroke", "black")
      .style("stroke-dasharray", "4 1")
      .style("opacity", 0.5);

    // handle dropdown menu
    function update(opt) {
      // scatxt.data(data.filter(function(d) { return d.w == opt}))
      //   .transition()
      //   .duration(500)
      //   .attr("x", function(d) { return x(d.x) + rad + 3; })
      //   .attr("y", function(d) { return y(d.y) + rad/2; });
      // scat.data(data.filter(function(d) { return d.w == opt}))
      //   .transition()
      //   .duration(500)
      //   .attr("cx", function(d) { return x(d.x); })
      //   .attr("cy", function(d) { return y(d.y); });
      
      console.log("update" + opt);

      gsenter.data(data.filter(function(d) { return d.w == opt}));

      gs.select("circle")
        .transition()
        .duration(500)
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); });
    }

    d3.select("#slider1").on("input", function() {
      var sel = +d3.select(this).property("value");
      update(sel);
    })

  });


  // ------------------
  // ROSTER MANAGEMENT

  d3.csv("data/data2.csv", function(data) {
    // ---------------
    // create dropdown

    d3.select("#menu2")
      .selectAll("option")
      .data(d3.map(data, function(d) { return d.w; }).keys())
      .enter().append("option")
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; });

    // -----------
    // scatter viz

    var margin = {top: 30, right: 30, bottom: 30, left: 30},
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Define the div for the tooltip
    var div = d3.select("body").append("div") 
      .attr("class", "tooltip")       
      .style("opacity", 0);

    // create x, y axes
    var x = d3.scaleLinear()
      .domain([0, 10])
      .range([0, width]);
    var y = d3.scaleLinear()
      .domain([0, 10])
      .range([height, 0]);  // y reversed

    // create main vis
    var vis = d3.select("#tab2chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
    // append axes to vis  
    vis.append("g")
      .call(d3.axisLeft(y));
    vis.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var scat = vis.append("g")
      .selectAll(".dot")
      .data(data.filter(function(d) { return d.w == 0}))
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); })
        .attr("r", 10)
        .style("fill", "blue")
        .style("opacity", 0.5)
      .on("mouseover", function(d) {
        // make full color
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 12)
          .style("opacity", 1.);

        // tooltip
        div.transition()
          .duration(200)
          .style("opacity", 0.9);
        div.html("(" + d.x + ", " + d.y + ")")
          .style("left", (x(d.x) + document.getElementById("tab2chart").offsetLeft) + "px")
          .style("top", (y(d.y) + document.getElementById("tab2chart").offsetTop) + "px");
      })
      .on("mouseout", function(d) {
        // back to transparent
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 10)
          .style("opacity", 0.5);

        // tooltip hid
        div.transition()
          .duration(200)
          .style("opacity", 0);
      });

    // append y=x line
    vis.append("line")
      .attr("x1", x(0))
      .attr("x2", x(10))
      .attr("y1", y(0))
      .attr("y2", y(10))
      .style("stroke", "black")
      .style("stroke-dasharray", "4 1")
      .style("opacity", 0.5);

    // handle dropdown menu
    function update(opt) {
      scat.data(data.filter(function(d) { return d.w == opt}))
        .transition()
        .duration(500)
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); });
    }

    // when dropdown is changed, run update
    d3.select("#menu2").on("change", function(d) {
      var sel = +d3.select(this).property("value");
      update(sel);
    })
  })

  // arrange labels
  // http://bl.ocks.org/larskotthoff/11406992

})