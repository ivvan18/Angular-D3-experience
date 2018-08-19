import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import * as moment from 'moment';
import * as D3 from 'd3';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

import { STOCKS } from './data/stocks';

@Component({
  selector: 'app-line-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>;

  constructor() {
    this.width = 450 - this.margin.left - this.margin.right;
    this.height = 200 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.drawLine();
    this.drawGridX();
    this.drawGridY();
  }

  private initSvg() {
    this.svg = d3.select('svg')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis() {
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(STOCKS, (d) => d.date ));
    this.y.domain(d3Array.extent(STOCKS, (d) => d.value ));
  }

  private drawAxis() {
    const dayInterval = moment(STOCKS[0].date).diff(moment(STOCKS[STOCKS.length - 1].date), 'days');
    // console.log(dayInterval);
    // const averageInterval = (dayInterval/STOCKS.length).toFixed(0);
    // console.log(averageInterval);
    // const ticksNumber = dayInterval/averageInterval;
    // console.log(ticksNumber);

    this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x).ticks(D3.timeDay.every(15)).tickFormat(D3.timeFormat('%b %d')).tickSizeOuter(0));

    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y).tickValues([0, Math.max(...STOCKS.map(x => x.value))]).tickSizeOuter(0))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('SP');
  }

  private drawLine() {
    this.line = d3Shape.line()
      .x( (d: any) => this.x(d.date) )
      .y( (d: any) => this.y(d.value) );

    this.svg.append('path')
      .datum(STOCKS)
      .attr('class', 'line')
      .attr('d', this.line);
  }

  // gridlines in x axis function
  private make_x_gridlines() {
    return d3Axis.axisBottom(this.x)
      .ticks(5);
  }

// gridlines in y axis function
  private make_y_gridlines() {
    return d3Axis.axisLeft(this.y)
      .ticks(5);
  }

  private drawGridX() {
    // add the X gridlines
    this.svg.append('g')
      .attr('class', 'grid')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.make_x_gridlines()
        .tickSize(-this.height)
        .tickFormat('')
      );
  }

  private drawGridY() {
    // add the Y gridlines
    this.svg.append('g')
      .attr('class', 'grid')
      .call(this.make_y_gridlines()
        .tickSize(-this.width)
        .tickFormat('')
      );
  }
}
