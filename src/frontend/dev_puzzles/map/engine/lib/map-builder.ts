import * as d3 from 'd3';

import { MapWithContent, KMap, KNode, KEdge } from '@colabo-knalledge/f-store_core';

export class MapBuilder{
    contentHtml: any;
    contentSvg: any;
    mapContent: MapWithContent;
    protected map:KMap;
    protected nodes:KNode[];
    protected edges:KEdge[];
    protected layoutNodes:any[];
    protected layoutEdges:any[];
    protected dataRootNode: any;
    protected kNodeSelected: KNode;

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
                let child: KNode = this._getNodeFromId(this.edges[i].targetId);
                child.visual.parentId = nodeId;
                children.push(child);
            }
        }
        return children;
    }

     //TODO: improve this for Big data by 2-dimensional array
    _getEdgesBetweenNodes(source:any, target:any, edgeType:string=undefined) {
        var edges = [];
        for (var i in this.edges) {
            var edge = this.edges[i];
            if (source._id === edge.sourceId && target._id === edge.targetId) {
                if (typeof edgeType === 'undefined' || edge.type === edgeType) {
                    edges.push(edge);
                }
            }
        }
        return edges;
    };

    setContentHtml(contentHtml: any): MapBuilder{
        this.contentHtml = contentHtml;
        return this;
    }
    
    setContentSvg(contentSvg: any): MapBuilder {
        this.contentSvg = contentSvg;
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
    
    updateMap(): MapBuilder {
        return this.layoutMapUpdate(this.dataRootNode)
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
        this.dataRootNode = d3.hierarchy(rootNode, this.getChildren.bind(this));
        this.dataRootNode.y0 = width / 2;
        this.dataRootNode.x0 = 0;
        this.layoutMapUpdate(this.dataRootNode)
            .layoutMapUpdateContainers();
        // const source:KNode = map.rootNodeId;
        // // Compute the new tree layout.
        // this.nodes = this.tree.nodes(source).reverse();
        // this.links = this.tree.links(this.nodes);

        return this;
    }
    
    layoutMapUpdateContainers(): MapBuilder {
        const width = 1000;
        const height = 1000;

        this.contentSvg
            .attr("width", width)
            .attr("height", height);

        return this;
    }

    layoutMapUpdate(source): MapBuilder{
        // Assigns the x and y position for the nodes
        var treeData = this.tree(source);
        // each node is of type d3.Node with `data` property containing the original KNode
        this.layoutNodes = treeData.descendants();
        // each edge is of type d3.Node with `source` and `tartget` properties containing the original source and target KNodes
        this.layoutEdges = treeData.links();

        //links are D3.tree-generated objects of type Object: {source, target}
        for (var i in this.layoutEdges) {
            const link = this.layoutEdges[i];
            const edges = this._getEdgesBetweenNodes(link.source.data, link.target.data);
            if (edges && edges[0]) {
                link.data = edges[0]; //TODO: see what will happen when we have more links between two nodes
            }
        }

        return this;
    }

    drawMapEdges(): MapBuilder {
        // Update the links...
        var link = this.contentSvg.selectAll('path.link')
            .data(this.layoutEdges, function (d: any) {
                return d.data._id; 
            });

        // Enter any new links at the parent's previous position.
        var linkEnter = link.enter().insert('path', "g")
            .attr("class", "link")
            .attr('d', function(d:any){
                var s = {x: d.source.x, y: d.source.y};
                var t = { x: d.target.x, y: d.target.y };
                return diagonal(s, t);
            });
        
        // Creates a curved (diagonal) path from parent to the child nodes
        function diagonal(s:any, t:any) {
            let path:string = `M ${s.y} ${s.x}
                C ${(s.y + t.y) / 2} ${s.x},
                ${(s.y + t.y) / 2} ${t.x},
                ${t.y} ${t.x}`;

            return path;
        }
        return this;
    }

    drawMapNodes(): MapBuilder{
        let that: MapBuilder = this;
        let nodesD3 = this.contentHtml.selectAll("div.map-node").data(this.layoutNodes, function (d: any) {
            return d.data._id;
        });

        nodesD3
            .enter()
            .append('div')
            .merge(nodesD3) //to apply both on new (enter) and existing 
            .attr('class', function(d){
               let classes:string = 'map-node click-area';
                if (that.kNodeSelected && d.data !== that.kNodeSelected && d.data.visual.parentId !== that.kNodeSelected._id) 
                    classes += ' unselected';
                if (that.kNodeSelected && d.data.visual.parentId === that.kNodeSelected._id)
                    classes += ' child_of_selected';
                if (d.data.visual.selected) classes+= ' selected';
                return classes;
            })
            .attr('id', function (d) { return d.data._id; })
            .style('top', function (d, i) { return d.x + "px"; })
            .style('left', function (d, i) { return d.y + "px"; })
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
    
    _unselectNodes(exceptNode:KNode){
        const exceptNodeId:string = exceptNode._id;
        for (var i: number = 0; i < this.nodes.length; i++) {
            if (this.nodes[i]._id !== exceptNodeId) {
                this.nodes[i].visual.selected = false;
            }
        }
    }

    nodeOver(d, i, object: any): void {
        // d3.select(object)
        //     .transition()
        //     .style("opacity", 0.6);
    }

    nodeOut(d, i, object: any): void {
        // d3.select(object)
        //     .transition()
        //     .style("opacity", 0.75);
    }

    nodeClick(d, i, object: any): void {
        // const kNode: KNode = object.data().data;
        const kNode: KNode = object.__data__.data;
        console.log('nodeClick (%s): %s', kNode.name, kNode.visual.selected);
        kNode.visual.selected = !kNode.visual.selected;
        if (kNode.visual.selected){
            this.kNodeSelected = kNode;
        }else{
            this.kNodeSelected = null;
        }
        this._unselectNodes(kNode);
        this.updateMap();
    }
}
