var years = ["2005", "2010", "2015"];

var chart = function() {

  var pillTypes = [
    {opts: {colour:["#00247D"]}, id:"en", name:"English"},
    {opts: {colour:["#DE2910"]}, id:"zh", name:"Chinese"},
    {opts: {colour:["#C70025"]}, id:"jp", name:"Japanese"},
    {opts: {colour:["#F1BF00"]}, id:"sp", name:"Spanish"},
    {opts: {colour:["#111111"]}, id:"de", name:"German"},
    {opts: {colour:["#0055A4"]}, id:"fr", name:"French"},
    {opts: {colour:["#003478"]}, id:"ko", name:"Korean"},
    {opts: {colour:["#009246"]}, id:"it", name:"Italian"},
    {opts: {colour:["#006600"]}, id:"pt", name:"Portuguese"},
    {opts: {colour:["#FF4F00"]}, id:"nl", name:"Dutch"},
    {opts: {colour:["#50C878"]}, id:"ar", name:"Arabic"},
    {opts: {colour:["#DE282E"]}, id:"ru", name:"Russian"},
    {opts: {colour:["#314CA5"]}, id:"ms", name:"Malay"},
    {opts: {colour:["#999999"]}, id:"xx", name:"Other"}
  ];

  var pillMap = d3.map(pillTypes, function(d) { return d.id; });
  var pillWidth = 140;
  var pillHeight = 19;
  var pillSpace = 10;
  var yearSpace = 70;
  var data = [];
  var aspect = 0;
  var margin = {top: 60, right: 10, bottom: 10, left: 10};
  var width;
  var height;
  var svg = null;
  var g = null;
  var defs = null;

  function pillPath(width, height, padding) {

    var edge = width / 10;
    var halfHeight = height / 2;

    var path = "M 0," + halfHeight;
    path += " l " + edge + "," + (-1 * halfHeight);
    path += " l " + (width - (edge * 2)) + ",0";
    path += " l " + edge + "," + halfHeight;
    path += " l " + (-1 * edge) + "," + halfHeight;
    path += " l " + (-1 * (width - (edge * 2))) + ",0";
    path += " Z";

    return path;
  }

  function drawPill(selection, width, height, opts) {
    selection.selectAll("rect")
      .data([opts.colour[0]]).enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", function(d) { return d; });
  }

  function prepareData(rawData) {
    rawData.forEach(function(d) {
      years.forEach(function(y) {
        d[y] = +d[y];
      });
    });

    return rawData;
  }

  function createLinks(data) {
    var links = [];
    data.forEach(function(d) {
      for(var i = 1; i < years.length; i++) {
        links.push({id:d.id, start:d[years[i-1]], end:d[years[i]], gap:i});
      }
    });

    return links.filter(function(l) { return l.start > 0 && l.end > 0; });
  }

  function getLabels(data) {
    endYears = [];
    data.forEach(function(d) {
      var started = false;
      for(var i = 0; i < years.length; i++) {
        if(started && ((isNaN(d[years[i]]) || d[years[i]] == -1))) {
          var yr = {
            id:d.id,
            year:years[i - 1],
            pos:d[years[i - 1]],
            name:pillMap.get(d.id).name,
            index:i - 1
          };
          endYears.push(yr);
        } else if( i + 1 === years.length ) {
          endYears.push({id:d.id, year:years[i], pos:d[years[i]], name:pillMap.get(d.id).name, index:i});
        }
        if((d[years[i]] !== -1) && (i == 0 || i > 0))
        {
          started = true;
        }
      }
    });

    return endYears;
  }

  var chart = function(selection) {
    selection.each(function(rawData) {
      data = prepareData(rawData);
      var links = createLinks(data);
      var cityTitles = getLabels(data);

      svg = d3.select(this).selectAll("svg").data([data]);
      var gEnter = svg.enter().append("svg").append("g");

      width = (pillWidth + yearSpace) * years.length;
      height = (pillHeight + pillSpace) * 11;

      svg.attr("width", width + margin.left + margin.right );
      svg.attr("height", height + margin.top + margin.bottom );
      svg.attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom));
      svg.attr("preserveAspectRatio", "xMidYMid");

      aspect = (width + margin.left + margin.right) / (height + margin.left + margin.right);

      defs = svg.append("defs");

      var pill = defs.append("clipPath")
        .attr("id", "pill")
        .append("path")
        .attr("d", pillPath(pillWidth, pillHeight));

      g = svg.select("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      g.selectAll(".rank-title")
        .data(data.filter(function(d) { return (d.share > 0); }))
        .enter()
        .append("text")
        .attr("class", "title rank-title")
        .attr("x", 0)
        .attr("dx", (pillWidth + yearSpace) * (years.length-1) + pillWidth + 20 )
        .attr("dy", pillHeight-2 )
        .attr("y", function(d,i) { return (pillHeight + pillSpace) * i - 4; })
        .attr("fill", "#aaa")
        .text(function(d) { return parseFloat(d.share).toFixed(1) + "%"; })

      var defpills = defs.selectAll("pill")
        .data(pillTypes)
        .enter()
        .append("g")
        .attr("id", function(d) { return d.id; })
        .attr("class", "pill")
        .attr("opacity", 0);

      defpills.append("g").attr("clip-path", "url(#pill)")
        .each(function(d,i) {
          d3.select(this).call(drawPill, pillWidth, pillHeight, d.opts);
        });

      defpills.append("path")
        .attr("class", "pill-outline")
        .attr("d", pillPath(pillWidth, pillHeight));

      g.selectAll("links").data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("opacity", 0)
        .attr("x1", function(d,i) { return ((pillWidth + yearSpace) * d.gap) - (yearSpace ); })
        .attr("y1", function(d,i) { return (pillHeight + pillSpace) * (d.start - 1) + (pillHeight / 2); })
        .attr("x2", function(d,i) { return ((pillWidth + yearSpace) * d.gap); })
        .attr("y2", function(d,i) { return (pillHeight + pillSpace) * (d.end - 1) + (pillHeight / 2); });

      var year = g.selectAll("year").data(years)
        .enter()
        .append("g")
        .attr("class", function(d,i) { return "year year-" + d } )
        .attr("transform", function(d,i) { return "translate(" + ((pillWidth + yearSpace) * i) + ",0)";  });

      year.append("text")
        .attr("class", "title year-title")
        .attr("text-anchor", "middle")
        .attr("x", pillWidth / 2)
        .attr("dy", -15)
        .text(function(d) { return d; });

      year.selectAll("pill-use")
        .data(function(y) {
          return data.map(function(d) {
            return {"id":d.id, "value":d[y]};
          }).filter(function(d) { return (d.value > 0); });
        })
        .enter()
        .append("use")
        .attr("xlink:href", function(d) { return "#" + d.id;})
        .attr("class", "pill-use")
        .attr("transform", function(d,i) {
          return "translate(0," + (d.value - 1) * (pillHeight + pillSpace) + ")";
        })
        .on("mouseover", highlightBranch)
        .on("mouseout", resetHighlighting);

      g.selectAll("end-title")
        .data(cityTitles)
        .enter()
        .append("text")
        .attr("class", "title end-title")
        .attr("fill", "#fff")
        .attr("transform", function(d,i) {
          var x = ((pillWidth + yearSpace) * d.index);
          var y = (d.pos ) * (pillHeight + pillSpace);
          return "translate(" + x + "," + y + ")";
        })
        .attr("text-anchor", function(d) { return "middle" })
        .attr("dx", function(d) { return pillWidth / 2 })
        .attr("dy", -1 * (pillHeight - 1) + 2)
        .text(function(d) { return d.name; });

      g.append("text")
        .attr("class", "title main-title")
        .attr("x", 10)
        .attr("y", -40)
        .text("Languages by internet users: 2005–2015");

      animateIn();
    });
  };

  function animateIn() {
    n = 0;
    var langsInterval = setInterval(function() {
      defs.selectAll(".pill")
        .transition()
        .duration(800)
        .attr("opacity", function(d) { return (pillTypes[n].id === d.id) ? 1 : 0; })      
      g.selectAll(".link")
        .transition()
        .duration(800)
        .attr("opacity", function(d) { return (pillTypes[n].id === d.id) ? 1 : 0; })
      n++
      if(n >= pillTypes.length) {
          clearInterval(langsInterval);
          defs.selectAll(".pill")
            .transition()
            .duration(800)
            .attr("opacity", 1)
          g.selectAll(".link")
            .transition()
            .duration(800)
            .attr("opacity", 1)
      }
    }, 3000);
  }

  function highlightBranch(d,i) {
    defs.selectAll(".pill")
      .classed("highlight", function() {return d3.select(this).attr("id") === d.id;})
      .classed("unhighlight", function(e) {return e.id !== d.id; });
    g.selectAll(".link")
      .classed("highlight", function(e) {return e.id === d.id; })
      .classed("unhighlight", function(e) {return e.id !== d.id; });
  }

  function resetHighlighting(d,i) {
    defs.selectAll(".pill").classed("highlight", false);
    defs.selectAll(".pill").classed("unhighlight", false);
    g.selectAll(".link").classed("highlight", false);
    g.selectAll(".link").classed("unhighlight", false);
  }

  return chart;
};

var plot = chart();

function display(error, data) {
  d3.select("#vis").datum(data).call(plot);
}

d3.csv("data/pops.csv", display);