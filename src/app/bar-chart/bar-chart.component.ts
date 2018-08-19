import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import * as D3 from 'd3';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

import { STATISTICS } from './data/statistics';

@Component({
  selector: 'app-bar-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  title = 'Bar Chart';

  private width: number;
  private height: number;
  private margin = {top: 20, right: 20, bottom: 30, left: 40};

  private x: any;
  private y: any;
  private svg: any;
  private g: any;

  constructor() {}

  ngOnInit() {
    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.drawBars();
  }

  private initSvg() {
    this.svg = d3.select('svg');
    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    this.g = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis() {
    this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.1);
    this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
    this.x.domain(STATISTICS.map((d) => d.date));
    this.y.domain([0, d3Array.max(STATISTICS, (d) => d.value)]);
  }

  private drawAxis() {
    this.g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x).tickFormat(D3.timeFormat('%b %d')).tickSizeOuter(0));
    this.g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y).tickValues([0, Math.max(...STATISTICS.map(x => x.value))]).tickSizeOuter(0))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('SP');
  }

  private drawBars() {
    this.g.selectAll('.bar')
      .data(STATISTICS)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => this.x(d.date) )
      .attr('y', (d) => this.y(d.value) )
      .attr('width', this.x.bandwidth())
      .attr('height', (d) => this.height - this.y(d.value) );
  }

}
