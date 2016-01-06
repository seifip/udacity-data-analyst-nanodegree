var years = ["2005", "2010", "2015"];

var chart = function() {

  //language codes, associated names & colours
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

  //pills
  var pillMap = d3.map(pillTypes, function(d) { return d.id; });
  var pillWidth = 140;
  var pillHeight = 19;
  var pillSpace = 10;
  var yearSpace = 70;
  //holders
  var data = [];
  var svg = null;
  var g = null;
  var defs = null;
  //animation state
  var animationOver = false;
  //visualization size and margins
  var aspect = 0;
  var margin = {top: 60, right: 10, bottom: 10, left: 10};
  var width;
  var height;

  //generates svg path of a hexagonal pill
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

  //draws pills
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

  //parses data as numbers
  function prepareData(rawData) {
    rawData.forEach(function(d) {
      years.forEach(function(y) {
        d[y] = +d[y];
      });
    });

    return rawData;
  }

  //generates an array of links from the data
  //start: initial rank of the language
  //end: new rank of the language
  //gap: horizontal (year) gap multiplier
  function createLinks(data) {
    var links = [];
    data.forEach(function(d) {
      for(var i = 1; i < years.length; i++) {
        links.push({id:d.id, start:d[years[i-1]], end:d[years[i]], gap:i});
      }
    });

    return links.filter(function(l) { return l.start > 0 && l.end > 0; });
  }

  //generates language name labels from the data
  //the label is displayed on the last year the
  //language remains in the top ranking
  //id: language id
  //year: year
  //pos: language rank
  //name: full language name
  //index: last column the language is in the ranking
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
          endYears.push({id:d.id, year:years[i], pos:d[years[i]],
                          name:pillMap.get(d.id).name, index:i});
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
      data = prepareData(rawData); //parse data
      var links = createLinks(data); //generate links
      var languageNames = getLabels(data); //generate labels

      svg = d3.select(this).selectAll("svg").data([data]);
      var gEnter = svg.enter().append("svg").append("g");

      //define svg width based on the number of years displayed
      width = (pillWidth + yearSpace) * years.length;
      //define svg height for 11 languages
      height = (pillHeight + pillSpace) * 11;

      //set svg size and aspect ratio attributes
      svg.attr("width", width + margin.left + margin.right );
      svg.attr("height", height + margin.top + margin.bottom );
      svg.attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " "
                                 + (height + margin.top + margin.bottom));
      svg.attr("preserveAspectRatio", "xMidYMid");

      //append pill holder to the svg
      defs = svg.append("defs");

      //append a pill to the holder
      var pill = defs.append("clipPath")
        .attr("id", "pill")
        .append("path")
        .attr("d", pillPath(pillWidth, pillHeight));

      //append labels for current internet language share in %
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

      //draw pills
      defpills.append("g").attr("clip-path", "url(#pill)")
        .each(function(d,i) {
          d3.select(this).call(drawPill, pillWidth, pillHeight, d.opts);
        });
      defpills.append("path")
        .attr("class", "pill-outline")
        .attr("d", pillPath(pillWidth, pillHeight));

      //append and position links between pills
      g.selectAll("links").data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("opacity", 0)
        .attr("x1", function(d,i) { return ((pillWidth + yearSpace)
                                      * d.gap) - (yearSpace); })
        .attr("y1", function(d,i) { return (pillHeight + pillSpace)
                                      * (d.start - 1) + (pillHeight / 2); })
        .attr("x2", function(d,i) { return ((pillWidth + yearSpace)
                                      * d.gap); })
        .attr("y2", function(d,i) { return (pillHeight + pillSpace)
                                      * (d.end - 1) + (pillHeight / 2); });

      //append year labels for each row
      var year = g.selectAll("year").data(years)
        .enter()
        .append("g")
        .attr("class", function(d,i) { return "year year-" + d } )
        .attr("transform", function(d,i) { return "translate("
                                            + ((pillWidth + yearSpace) * i)
                                            + ",0)"; 
                                         });
      year.append("text")
        .attr("class", "title year-title")
        .attr("text-anchor", "middle")
        .attr("x", pillWidth / 2)
        .attr("dy", -15)
        .text(function(d) { return d; });

      //language branches for interaction
      //highlight languages on mouse over
      //reset highlighting on mouse out
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

      //language name labels on the last year the
      //language appears in the ranking
      g.selectAll("end-title")
        .data(languageNames)
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

      //append the main visualization title
      g.append("text")
        .attr("class", "title main-title")
        .attr("x", 10)
        .attr("y", -40)
        .text("Languages by internet users: 2005–2015");

      animateIn();
    });
  };

  //animates content based on the overarching story
  function animateIn() {
    //list of languages in decline
    var falling = ["jp", "de", "fr", "ko", "it", "nl"]
    //list of rising languages
    var rising = ["sp", "pt", "ar", "ru", "ms"]

    //animate in and out the first title
    $('.main-title').hide().html("In 2005, the internet remained a privilege...")
                    .fadeIn(2000).delay(1500).fadeOut(2000)
    //wait for the first title to fade out, animate in-out second title
    setTimeout(function() {
      $('.main-title').hide().html("Except China, most users came from developed countries")
                      .fadeIn(2000).delay(1500).fadeOut(2000)
    }, 6000);
    //wait for the second title to fade out, animate in-out third title
    setTimeout(function() {
      $('.main-title').hide().html("But share of Old World users has seen a rapid decline over the last decade")
                      .fadeIn(2000).delay(1500).fadeOut(2000)
    }, 12000);
    //wait for the third title to fade out, animate in-out fourth title
    setTimeout(function() {
      $('.main-title').hide().html("And speakers of many languages even dropped off from the top ranking")
                      .fadeIn(2000).delay(1500)
    }, 18000);
    //wait for the fourth title to fade out
    //progressively fade in all languages in decline
    //then hide all languages and title
    setTimeout(function() {
      var n = 0
      var shown = []
      var langsInterval = setInterval(function() {
        defs.selectAll(".pill")
          .transition()
          .duration(800)
          .attr("opacity", function(d) { return ( falling[n] === d.id
                                                  || $.inArray(d.id, shown) > -1 ) ? 1 : 0;
                                       })
        g.selectAll(".link")
          .transition()
          .duration(800)
          .attr("opacity", function(d) { return ( falling[n] === d.id
                                                  || $.inArray(d.id, shown) > -1 ) ? 1 : 0;
                                       })
        shown.push(falling[n])
        n++
        if(n > falling.length) {
            clearInterval(langsInterval);
            defs.selectAll(".pill")
              .transition()
              .duration(800)
              .attr("opacity", 0)
            g.selectAll(".link")
              .transition()
              .duration(800)
              .attr("opacity", 0)
            $('.main-title').fadeOut(2000)
        }
      }, 3000);
    }, 17000);
    //fade in and out the fourth title
    setTimeout(function() {
      $('.main-title').hide().html("As users speaking languages of populated developing countries took over")
                      .fadeIn(2000).delay(1500)
    }, 40000);
    //wait for the fifth title to fade out
    //progressively fade in all languages on the rise
    //then hide all languages and title
    setTimeout(function() {
      var n = 0
      var shown = []
      var langsInterval = setInterval(function() {
        defs.selectAll(".pill")
          .transition()
          .duration(800)
          .attr("opacity", function(d) { return ( rising[n] === d.id
                                          || $.inArray(d.id, shown) > -1 ) ? 1 : 0;
                                       })      
        g.selectAll(".link")
          .transition()
          .duration(800)
          .attr("opacity", function(d) { return ( rising[n] === d.id
                                          || $.inArray(d.id, shown) > -1 ) ? 1 : 0;
                                       })
        shown.push(rising[n])
        n++
        if(n > rising.length) {
            clearInterval(langsInterval);
            defs.selectAll(".pill")
              .transition()
              .duration(800)
              .attr("opacity", 0)
            g.selectAll(".link")
              .transition()
              .duration(800)
              .attr("opacity", 0)
            $('.main-title').fadeOut(2000)
        }
      }, 3000);
    }, 39000);
    //show all languages and default title, for the user to explore
    setTimeout(function() {
      $('.main-title').hide().html("Languages by internet users: 2005–2015")
                      .fadeIn(2000)
      defs.selectAll(".pill")
        .transition()
        .duration(800)
        .attr("opacity", 1)
      g.selectAll(".link")
        .transition()
        .duration(800)
        .attr("opacity", 1)
      animationOver = true;
    }, 60000);
  }

  //highlights a single language
  function highlightBranch(d,i) {
    if(animationOver)
    {
      defs.selectAll(".pill")
        .classed("highlight", function() {return d3.select(this).attr("id") === d.id;})
        .classed("unhighlight", function(e) {return e.id !== d.id; });
      g.selectAll(".link")
        .classed("highlight", function(e) {return e.id === d.id; })
        .classed("unhighlight", function(e) {return e.id !== d.id; });
    }
  }

  //resets language highlighting
  function resetHighlighting(d,i) {
    if(animationOver)
    {
      defs.selectAll(".pill").classed("highlight", false);
      defs.selectAll(".pill").classed("unhighlight", false);
      g.selectAll(".link").classed("highlight", false);
      g.selectAll(".link").classed("unhighlight", false);
    }
  }

  return chart;
};

var plot = chart();

function display(error, data) {
  d3.select("#vis").datum(data).call(plot);
}

d3.csv("data/pops.csv", display);