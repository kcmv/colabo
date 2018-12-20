import * as d3 from 'd3';

import { MapWithContent } from '@colabo-knalledge/f-store_core';

export class MapBuilder{
    contentHtml: any;
    mapContent: MapWithContent;

    constructor(){
        
    }
    
    setContentHtml(contentHtml: any): MapBuilder{
        this.contentHtml = contentHtml;
        return this;
    }
    
    setMapContent(mapContent: MapWithContent): MapBuilder{
        this.mapContent = mapContent;
        return this;
    }
    
    buildMap(){
        let nodesD3 = this.contentHtml.selectAll("div.map-node").data(this.mapContent.nodes);

        nodesD3
            .enter()
            .append('div')
            .merge(nodesD3) //to apply both on new (enter) and existing 
            .attr('class', 'map-node click-area')
            .attr('id', function (d) { return d._id; })
            .style('top', function (d, i) { return i * 35 + "px"; })
            .style('left', function (d, i) { return i * 5 + "px"; })
            .style('width', function (d) { return 200 + "px"; })
            .style('height', function (d) { return 25 + "px"; })
            .style('border', function (d) { return true ? 'black solid 2px' : 'none'; })
            .style('background-color', function (d) { return true ? 'yellow' : 'gray'; }) //'rgba(200, 200, 220)') //'rgba(200, 200, 220, 0.3)')
            .html(function (d) {
                // return this.showActionNamesonFlow ? (d.name + this.noCh) : '';
                return d.name;
            })
            .on("mouseover", function (d, i) { this.nodeOver(d, i, this); })
            .on("mouseout", function (d, i) { this.nodeOut(d, i, this); })
            .on("click", function (d, i) { this.nodeClick(d, i, this); })
    }

    nodeOver(d, i, object: any): void {
        d3.select(object)
            .transition()
            .style("opacity", 0.6);
    }

    nodeOut(d, i, object: any): void {
        d3.select(object)
            .transition()
            .style("opacity", 0.75);
    }

    nodeClick(d, i, object: any): void {
        console.log('nodeClick', d.name);
        d3.select(object)
            .style('background-color', false ? 'yellow' : 'gray')
    }
}
