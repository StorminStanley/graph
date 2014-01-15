'use strict';
/*jshint bitwise: false*/

var renderOrder = [
  'area',
  'bar',
  'line',
  'spot'
];

angular.module('main')
  .directive('st2Graphic', ['st2CustomTimeFormat', function (customTimeFormat) {
    
    return {
      restrict: 'E',
      scope: {
        spec: '='
      },
      link: function postLink(scope, element) {
        var vis = d3.select(element[0]).append("svg:svg")
                    .attr('preserveAgraphtRatio', 'none'),
            margins = { top: 10, right: 10, bottom: 10, left: 10},
            graph,
            x, y, w, h, minTime, maxTime, minValue, maxValue,
            layerIndex = {};
        
        var calcScale = function () {
          w = parseInt(vis.style('width'), 10);
          h = parseInt(vis.style('height'), 10);
          
          minTime = graph.getMinTime();
          maxTime = graph.getMaxTime();
          
          minValue = graph.opts.yAxis.from !== undefined ?
            graph.opts.yAxis.from : graph.getMinValue();
          maxValue = graph.opts.yAxis.to !== undefined ?
            graph.opts.yAxis.to : graph.getMaxValue();
          
          x = d3.scale.linear()
            .domain([minTime, maxTime])
            .range([0 + margins.left, w - margins.right])
            .clamp(true);
          
          y = d3.scale.linear()
            .domain([maxValue, minValue])
            .range([0 + margins.top, h - margins.bottom]);
        };
        
        var draw = _.debounce(function draw() {
          if (!graph || !_.keys(graph.layers).length) {
            return;
          }
          
          calcScale();
          
          var types = {
            line: d3.svg.line()//.interpolate("cardinal")
              .x(function (d) { return x(d[0]); })
              .y(function (d) { return y(d[1]); }),
            area: d3.svg.area()
              .x(function (d) { return x(d[0]); })
              .y1(function (d) { return y(d[1]); })
              .y0(h - margins.bottom)
          };
          
          _(scope.spec.layers).sortBy(function (layer) {
            var index = renderOrder.indexOf(layer.opts.type || 'line');
            return index !== -1 ? index : renderOrder.indexOf('line');
            // You should be careful with area charts since they tend to cover each other.
          }).each(function (layer) {
            if (!layer.error && layer.values) {
              var group = layerIndex[layer.channel].group =
                          layerIndex[layer.channel].group || vis.insert("g", ".st2-graphic__cursorGroup")
                                                            .attr('class', 'st2-graphic__graph');
              
              var graph = group.selectAll("path")
                .data([layer.values], function (d) {
                  return d.length && d[d.length - 1][0];
                })
                .attr("d", types[layer.opts.type || 'line'])
                .style(layer.opts.type && layer.opts.type !== 'line' ? {
                  fill: layer.opts.color,
                  stroke: 'none'
                } : {
                  fill: 'none',
                  stroke: layer.opts.color
                });
              
              graph.enter().append("svg:path")
                .attr("class", "st2-graphic__line")
                .attr("d", types[layer.opts.type || 'line'])
                .style(layer.opts.type && layer.opts.type !== 'line' ? {
                  fill: layer.opts.color,
                  stroke: 'none'
                } : {
                  fill: 'none',
                  stroke: layer.opts.color
                });
              
              graph.exit().remove();
            }
          });
          
          var timeScale = d3.time.scale()
            .domain([new Date(minTime * 1000), new Date(maxTime * 1000)])
            .range([0 + margins.left, w - margins.right]);
          
          var xAxis = d3.svg.axis()
              .scale(timeScale)
              .orient("bottom")
              .ticks(5)
              .tickFormat(customTimeFormat)
              .tickPadding(5);
          
          var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .ticks(5)
              .tickPadding(5)
              .tickSize(w - margins.left - margins.right);
          
          vis.select(".st2-graphic__x-axis")
            .attr("transform", "translate(0," + (h - margins.bottom) + ")")
            .call(xAxis);
          vis.select(".st2-graphic__y-axis")
            .attr("transform", "translate(" + (w - margins.right) + ",0)")
            .call(yAxis);
        }, 150);
        
        var lastWatch = function () {};
        
        scope.$watch('spec', function (val) {
          
          if (!val) {
            return;
          }
          
          graph = val;
          
          calcScale();
          
          if (graph.opts.style) {
            vis.attr('style', graph.opts.style);
          }
          
          if (graph.opts.xAxis) {
            margins.left = margins.right = 14;
            margins.bottom = 24;
            
            vis.append("g").attr("class", "st2-graphic__x-axis");
          }
          
          if (graph.opts.yAxis) {
            margins.left = 28;
            
            vis.append("g").attr("class", "st2-graphic__y-axis");
          }
          
          lastWatch();
          
          console.log(vis[0][0], '1', layerIndex);
          
          _.each(layerIndex, function (e, i, l) {
            e.unwatch();
            e.group.remove();
            delete l[i];
          });
          
          console.log(vis[0][0], '2', layerIndex);
          
          lastWatch = scope.$watch(function () {
            return _.keys(graph.layers);
          }, function (n, o) {
            console.log(vis[0][0], '3', layerIndex);
            _(o).difference(n).each(function (layerName) {
              layerIndex[layerName].unwatch();
              layerIndex[layerName].group && layerIndex[layerName].group.remove();
              delete layerIndex[layerName];
              draw();
            });
          
            _.each(n, function (layerName) {
              layerIndex[layerName] = layerIndex[layerName] || {
                unwatch: graph.layers[layerName].$watch(function (scope) {
                  return {
                    values: scope.values,
                    opts: scope.opts
                  };
                }, function () {
                  draw();
                }, true)
              };
            });
            
            console.log(vis[0][0], '4', layerIndex);
          }, true);
          
          var cursorGroup = vis.append('g').attr('class', 'st2-graphic__cursorGroup')
            , selection = cursorGroup
                .append('svg:rect')
                .attr('class', 'st2-graphic__selector');
          
          graph.$on('cursormove', function (e, coord) {
            var cursor = cursorGroup.selectAll('line')
              .data(coord ? [coord] : [])
              .attr('x1', function (d) { return x && x(d); })
              .attr('y1', margins.top)
              .attr('x2', function (d) { return x && x(d); })
              .attr('y2', h && h - margins.bottom);
          
            cursor.enter().append('svg:line')
              .attr('class', 'st2-graphic__cursor')
              .attr('x1', function (d) { return x && x(d); })
              .attr('y1', margins.top)
              .attr('x2', function (d) { return x && x(d); })
              .attr('y2', h && h - margins.bottom);
          
            cursor.exit().remove();
          });
          
          scope.$on('timeframeStart', function (e, coord) {
            var start = x(coord);
          
            selection
              .attr('y', margins.top)
              .attr('height', h - margins.bottom);
          
            var off = graph.$on('cursormove', function (e, coord) {
              var finish = x(coord);
              if (start < finish) {
                selection
                  .attr('x', start)
                  .attr('width', finish - start);
              } else {
                selection
                  .attr('x', finish)
                  .attr('width', start - finish);
              }
            });
          
            scope.$on('timeframeStop', function () {
              off();
              selection.attr('width', undefined);
            });
          });
          
        });
        
        vis.on('mousemove', function () {
          if (x) {
            var coord = x.invert(d3.mouse(this)[0]);
            scope.$emit('cursormove', coord);
          }
        });
        
        var coord1, coord2;
        
        var drag = d3.behavior.drag()
          .on('dragstart', function () {
            if (x) {
              coord1 = x.invert(d3.mouse(this)[0]);
              scope.$emit('timeframeStart', coord1);
            }
          })
          .on('dragend', function () {
            if ((coord1 || coord1 === 0) && (coord2 || coord2 === 0) && coord1 !== coord2) {
              var from = coord1 < coord2 ? coord1 : coord2
                , to = coord1 < coord2 ? coord2 : coord1;
              
              scope.$emit('timeframeChanged', to | 0, from | 0);
            }
            scope.$emit('timeframeStop');
            scope.$emit('cursormove', coord2 || coord1);
            coord1 = null;
            coord2 = null;
          })
          .on("drag", function () {
            if (x) {
              coord2 = x.invert(d3.mouse(this)[0]);
            }
          });
        
        vis.call(drag);
        
        scope.$on('resize', draw);
      }
    };
  }]);