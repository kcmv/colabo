import * as d3 from 'd3';

import { MapWithContent, KMap, KNode, KEdge } from '@colabo-knalledge/f-store_core';

export class MapBuilder{
    contentHtml: any;
    mapContent: MapWithContent;
    protected map:KMap;
    protected nodes:KNode[];
    protected edges:KEdge[];
    protected layoutNodes:any[];
    protected layoutEdges:any[];

    protected tree:any;

    constructor(){
        
    }
    
    _getNodeFromId(nodeId: string): KNode {
        for (var i: number = 0; i < this.nodes.length; i++) {
            if (this.nodes[i]._id === nodeId) {
                return this.nodes[i];
            }
        }
        return null;
    }

    _getChildrenForNodeId(nodeId:string):KNode[]{
        const children = [];
        for (var i: number = 0; i < this.edges.length; i++) {
            if (this.edges[i].sourceId === nodeId) {
                children.push(this._getNodeFromId(this.edges[i].targetId));
            }
        }
        return children;
        
    }
    
    setContentHtml(contentHtml: any): MapBuilder{
        this.contentHtml = contentHtml;
        return this;
    }
    
    setMapContent(mapContent: MapWithContent): MapBuilder{
        this.mapContent = mapContent;
        this.map = this.mapContent.map;
        this.nodes = this.mapContent.nodes;
        this.edges = this.mapContent.edges;
        return this;
    }
    
    buildMap(): MapBuilder{
        return this.layoutMap()
            .drawMapNodes()
            .drawMapEdges();
    }
    
    getChildren(d:KNode): KNode[] {
        var that = this;
        // if (d.isOpen === false) return [];
        return this._getChildrenForNodeId(d._id);
    }
    
    layoutMap():MapBuilder{
        const width:number = 1500;
        const height:number = 1000;
        this.tree = d3.tree().size([width, height]);
        const map:KMap = this.mapContent.map;
        const nodes:KNode[] = this.mapContent.nodes;
        const rootNode:KNode = this._getNodeFromId(map.rootNodeId);
        const root:any = d3.hierarchy(rootNode, this.getChildren.bind(this));
        root.y0 = width / 2;
        root.x0 = 0;
        this.layoutMapUpdate(root);
        // const source:KNode = map.rootNodeId;
        // // Compute the new tree layout.
        // this.nodes = this.tree.nodes(source).reverse();
        // this.links = this.tree.links(this.nodes);

        return this;
    }
    
    layoutMapUpdate(source): MapBuilder{
        // Assigns the x and y position for the nodes
        var treeData = this.tree(source);
        this.layoutNodes = treeData.descendants();
        this.layoutEdges = treeData.links();
        return this;
    }

    drawMapEdges(): MapBuilder {
        // Update the links...
        // var link = svg.selectAll('path.link')
        //     .data(this.layoutEdges, function(d) { return d.id; });

        // // Enter any new links at the parent's previous position.
        // var linkEnter = link.enter().insert('path', "g")
        //     .attr("class", "link")
        //     .attr('d', function(d){
        //         var o = {x: source.x0, y: source.y0}
        //         return diagonal(o, o)
        //     });
        
        // Creates a curved (diagonal) path from parent to the child nodes
  
        function diagonal(s:any, d:any) {

            let path:string = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`;

            return path;
        }
        return this;
    }

    drawMapNodes(): MapBuilder{
        let that: MapBuilder = this;
        let nodesD3 = this.contentHtml.selectAll("div.map-node").data(this.layoutNodes);

        nodesD3
            .enter()
            .append('div')
            .merge(nodesD3) //to apply both on new (enter) and existing 
            .attr('class', 'map-node click-area')
            .attr('id', function (d) { return d.data._id; })
            .style('top', function (d, i) { return d.x + "px"; })
            .style('left', function (d, i) { return d.y + "px"; })
            .style('width', function (d) { return 200 + "px"; })
            // .style('height', function (d) { return 25 + "px"; })
            .style('border', function (d) { return true ? 'black solid 2px' : 'none'; })
            .style('background-color', function (d) { return true ? 'yellow' : 'gray'; }) //'rgba(200, 200, 220)') //'rgba(200, 200, 220, 0.3)')
            .html(function (d) {
                // return this.showActionNamesonFlow ? (d.data.name + this.noCh) : '';
                return d.data.name;
            })
            .on("mouseover", function (d, i, dataArray) { 
                that.nodeOver(d, i, this);
            })
            .on("mouseout", function (d, i, dataArray) { that.nodeOut(d, i, this); })
            .on("click", function (d, i, dataArray) { that.nodeClick(d, i, this); })
        return this;
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
