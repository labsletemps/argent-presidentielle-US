// sdfa
/*
c3-charts
*/

var smallDevice = $(window).width() < 600;

var defaultPadding = {
  top: 10,
  right: 16,
  bottom: 10,
  left: 44,
};
var defaultColors = { pattern: ['#b80021', '#054E6B'] };
var defaultPoint = { r: 4	};

/*
Chart
*/

function generatePie(data){
  var columns = [];
  var className = '.' + data['slug'];

  var inlineBar = c3.generate({
    bindto: '#inline-' + data['slug'],
    interaction: {
      enabled: false
    },
    padding: {
      top: 0,
      right: 10,
      bottom: 0,
      left: 10
    },
    size: {
      // height: 80,
      // width: 180
    },
    data: {
        columns: [
            ['Total', data['Total'] ]
        ],
        type: 'bar'
    },
    bar: {
        width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
        }
    },
    legend: {
      show: false
    },
    color: { pattern: ['#bd3924', '#0f4e71'] },
    axis: {
      x: {
        show: false
      },
      y: {
        // show: false,
        tick: {
          values: [0, 200]
        },
        max: 210
      },
      rotated: true
    },
});

  $.each(data, function(key, item){
    if(['Grosses contributions', 'Petites contributions',
       'Autofinancement', 'Autres comités autorisés'].includes(key)){
      columns.push([key, item])
    }
  });

  $(className + ' .candidate-outside').text(data['Contributions extérieures']);


  $(className + ' .candidate-big').text(data['Grosses contributions'] + (data['Grosses contributions'] > 1 ? ' millions' : ' million') );
  $(className + ' .candidate-small').text(data['Petites contributions'] + (data['Petites contributions'] > 1 ? ' millions' : ' million') );
  $(className + ' .candidate-auto').text(data['Autofinancement'] + (data['Autofinancement'] > 1 ? ' millions' : ' million') );
  $(className + ' .candidate-other').text(data['Autres comités autorisés'] + (data['Autres comités autorisés'] > 1 ? ' millions' : ' million') );

  return c3.generate({
   		oninit: function() {
          // image au centre
          var center = d3
           	 .select('#chart-' + data['slug'])
             .select('.c3-chart-arcs')
             .insert("image",":first-child")
             .attr('x', -75)
             .attr('y', -75)
             .attr('width', 150)
             .attr('height', 150)
             .attr('xlink:href', 'img/candidates/' + data['image'] + '.jpg')
          },

      data: {
          columns: columns,
          type: 'donut',

          colors: {
              'Grosses contributions': '#00567b',
              'Petites contributions': '#f64715',
              'Autofinancement': '#a58723',
              'Autres comités autorisés': '#9c9c9c'
           }/*,
          onclick: function (d, i) { console.log("onclick", d, i); },
          onmouseover: function (d, i) { console.log("onmouseover", d, i); },
          onmouseout: function (d, i) { console.log("onmouseout", d, i); }*/
      },
      donut: {
        // width: 40,
        // label: {
        //   threshold: 0.1,
        //   format: function(value, ratio, id) {
        //     return d3.format("%")(ratio);
        //   }
        // }
      },
      legend: {
          show: false
      },
      bindto: '#chart-' + data['slug']

  });
}

$.getJSON( "data/candidates.json", function( data ) {
  var card_source = $("#card-template").html();
  var  card_template = Handlebars.compile(card_source);
  var html = card_template({ cards: data});

  $( ".card-container" ).html(html);

  $.each(data, function(name){
    generatePie(data[name])
  });
/*  generatePie(data['Donald Trump'])
  generatePie(data['Tom Steyer'])
  generatePie(data['Bernie Sanders'])*/

})
.fail(function (jqxhr, status, error) {
  console.log('error', status, error) }
);


var historic_names = {
  'Gagnant': ['Bill Clinton', 'George W. Bush', 'George W. Bush', 'Barack Obama', 'Barack Obama', 'Donald Trump'],
  'Perdant': ['Bob Dole', 'Al Gore', 'John Kerry', 'John McCain', 'Mitt Romney', 'Hillary Clinton']
};

function shorterName(name){
  var n = name.split(" ");
  return n[n.length - 1];
}

var chartHistoric = c3.generate({
  bindto: '#chart-historic',
  padding: defaultPadding,
  size: {
    height: 500,
  },
  data: {
    x: 'year',
    columns: [
      ['year', 1996, 2000, 2004, 2008, 2012, 2016],
      ['Gagnant', 124, 194, 378, 779, 743, 351],
      ['Perdant', 144, 133, 352, 402, 484, 586]
    ],
    type: 'bar',
    labels: {
      format: function (v, id, i, j) {
        if(id){
          return smallDevice ? shorterName(historic_names[id][i]) : historic_names[id][i]
        }
        return ''
      }
    }
  },
  color: { pattern: ['#bd3924', '#0f4e71'] },
  tooltip: {
    format: {
        title: function (d) {
          // Année
          return 'Présidentielle ' + d;
        },
        value: function (value, ratio, id) {
            return value + ' millions';
        }
    }
    },
    axis: {
    y: {
      max: 900,
      label: {
        text: 'Millions de dollars',
        position: 'outer-middle'
      }
    },
    rotated: true
  }
});

var chartAdvertising = c3.generate({
  bindto: '#chart-advertising',
  padding: defaultPadding,
  size: {
    height: 220,
  },
  data: {
    x: 'Election',
    columns: [
      ['Election', '2010', '2012', '2014', '2016', '2018', '2020*'] ,
      ['Milliards de dollars', 3.99, 4.28, 4.32, 6.25, 8.69, 10] ,
    ],
    type: 'bar',
  },
  color: { pattern: ['#bd3924', '#0f4e71'] },
  axis: {
    x: {
      type: 'category',
    },
    y: {
      max: 9.5,
      label: {
        text: 'Milliards de dollars',
        position: 'outer-middle'
      }
    }
  },
  legend: {
    show: false
  },
  transition: {
    duration: 1000
  }
});
