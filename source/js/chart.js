class Chart {

    constructor(opts) {

        this.data = opts.data;
        this.element = opts.element;
        this.suffix = opts.suffix ? opts.suffix : '';
        this.ylabel = opts.ylabel ? opts.ylabel : '';
        this.serie = opts.serie ? opts.serie : '';
        this.valuelabelsBottom = opts.valuelabelsBottom ? opts.valuelabelsBottom : false;

        var suffix = this.suffix;

        this.tool_tip = d3.tip()
          .attr("class", "d3-tip")
          .offset([-8, 0])
          .html(function(d) { return (d[0]).toLocaleString('fr-FR', {year: 'numeric'}) + ': ' + d[1] + suffix; });
        // create the chart
        this.draw();
    }

    draw() {
        // define width, height and margin
        this.width = this.element.offsetWidth;
        this.height = this.width / 2;
        this.margin = {
            top: 30,
            right: 75,
            bottom: 45,
            left: 52
        };
        this.padding = {
          top: 10,
          left: 30,
          right: 10,
          bottom: 0
        };
        if(this.serie == 'youth-unemployment'){
          this.padding.left = this.width/4;
          this.padding.right = this.width/4;
        };

        // set up parent element and SVG
        this.element.innerHTML = '';
        const svg = d3.select(this.element).append('svg');
        svg.attr('width',  this.width);
        svg.attr('height', this.height);

        // we'll actually be appending to a <g> element
        this.plot = svg.append('g')
            .attr('transform',`translate(${this.margin.left},${this.margin.top})`);

        // create the other stuff
        this.createScales();
        this.addAxes();
        this.addLine();

        // label
        svg.call(this.tool_tip);
    }

    createScales() {
        // m = margin
        const m = this.margin;

        const xExtent = d3.extent(this.data, d => d[0]);
        const yExtent = d3.extent(this.data, d => d[1]);

        // baseline a zero si positif
        if (yExtent[0] > 0) { yExtent[0] = 0; };
        if (this.serie == 'youth-unemployment'){ yExtent[1] = 35; }

        this.xScale = d3.scaleTime()
            .range([this.padding.left, this.width-(m.right + this.padding.right)])
            .domain(xExtent);

        this.yScale = d3.scaleLinear()
            .range([this.height-(m.top+m.bottom), this.padding.top])
            .domain(yExtent)
            .nice();
    }

    addAxes() {
        const m = this.margin;
        const parseDate = d3.timeParse("%Y");
        // create and append axis elements
        // this is all pretty straightforward D3 stuff

        let xAxis = d3.axisBottom()
           .scale(this.xScale)
           .ticks(2)
           .tickFormat(d3.timeFormat("%Y"))
           .tickValues([new Date('2008'), new Date('2013'), new Date('2018')]);

        // TODO: make it more reusable
        if(this.serie == 'youth-unemployment'){
           xAxis = d3.axisBottom()
              .scale(this.xScale)
              .ticks(2)
              .tickFormat(d3.timeFormat("%Y"))
              .tickValues([new Date('2008'), new Date('2018')]);
        }


        const yAxis = d3.axisLeft()
            .scale(this.yScale)
            .ticks(4)
            .tickFormat(d3.format(''));

        this.plot.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${this.height-(m.top+m.bottom)})`)
            .call(xAxis);

        this.plot.append("g")
            .attr("class", "y axis")
            .call(yAxis)

      // label axe des y
        this.plot.append("text")
         .attr("y", -m.top + this.padding.top)
         .attr("x", 0)
         .attr("dy", "1em")
         .style("text-anchor", "middle")
         .text(this.ylabel);

    }

    addLine() {
        const line = d3.line()
            .x(d => this.xScale(d[0]))
            .y(d => this.yScale(d[1]));

        this.plot.append('path')
            // use data stored in `this`
            .datum(this.data)
            .classed('line',true)
            .attr('d',line);
            // set stroke to specified color, or default to red
            // .style('stroke', this.lineColor || 'steelblue');

        // Add the scatterplot
        this.plot.selectAll("dot")
            .data(this.data)
          .enter().append("circle")
            .attr("r", 5)
            .attr("cx", d => this.xScale(d[0]))
            .attr("cy", d => this.yScale(d[1]))
            .on('mouseover', this.tool_tip.show)
            .on('mouseout', this.tool_tip.hide);

        // the js "this" problem
        var _data = this.data;
        var _positionBottom = this.valuelabelsBottom;
        this.plot.selectAll("valuelabels")
          .data(this.data)
          .enter().append('text')
          .filter(function(d, i) { return i === 0 || i === (_data.length - 1) })
          .attr("x", d => this.xScale(d[0]))
          .attr("y", d => this.yScale(d[1]))
          .attr("text-anchor", "middle")
          .text(d => d[1] + (this.suffix.length < 2 ? this.suffix : '') )
          .attr("transform", function(){
            if(_positionBottom){
              return "translate(0, 20)";
            }
            return "translate(0, -10)";
          });
    }

    // the following are "public methods"
    // which can be used by code outside of this file

    setColor(newColor) {
        this.plot.select('.line')
            .style('stroke', newColor);

        // store for use when redrawing
        this.lineColor = newColor;
    }

    setData(newData) {
        this.data = newData;

        // full redraw needed
        this.draw();
    }
}
