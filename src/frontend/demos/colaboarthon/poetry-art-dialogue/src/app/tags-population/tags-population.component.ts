import { Component, OnInit, Input } from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';

import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';
import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

import {UsersProfilingService} from '../users-profiling/users-profiling.service';


@Component({
  selector: 'tags-population',
  templateUrl: './tags-population.component.html',
  styleUrls: ['./tags-population.component.css']
})
export class TagsPopulationComponent implements OnInit {

  @Input() new_tags_list:string = `
  `;
  newTagsGroups:KNode[];
  newTagGroupIndex:number = 0;
  newTags:KNode[];
  newTagIndex:number = 0;

  constructor(
    private usersProfilingService: UsersProfilingService
  ) { }

  ngOnInit() {

  }

  get tagsGroups():KNode[]{
    return this.usersProfilingService.tagsGroups;
  }

  get tags():KNode[]{
    return this.usersProfilingService.tags;
  }
  createNewTagsGroupsAndTags():void{
    this.newTagGroupIndex = 0;
    this.newTagIndex = 0;
    this.newTagsGroups = [];
    this.newTags = [];

    this.createNewTagsGroups(function(){
      this.createNewTags();
    }.bind(this));
  }

  createNewTagsGroups(callback:Function=null):void{
    this.newTagGroupIndex = 0;

    this.newTagsGroups = JSON.parse(this.new_tags_list).tagsGroups;

    if(this.newTagGroupIndex < this.newTagsGroups.length){
      this.usersProfilingService.createNewTagsGroup(this.newTagsGroups[this.newTagGroupIndex++], newTagsGroupCreated.bind(this));
    }else{
      if(callback) callback();
    }

    function newTagsGroupCreated(newTagGroup:KNode, newTagGroupEdge:KEdge){
      if(this.newTagGroupIndex < this.newTagsGroups.length){
        this.usersProfilingService.createNewTagsGroup(this.newTagsGroups[this.newTagGroupIndex++], newTagsGroupCreated.bind(this));
      }else{
        if(callback) callback();
      }
    }
  }

  createNewTags(callback:Function=null):void{
    this.newTagIndex = 0;
    this.newTags = JSON.parse(this.new_tags_list).tags;

    if(this.newTagIndex < this.newTags.length){
      this.usersProfilingService.createNewTag(this.newTags[this.newTagIndex++], newTagCreated.bind(this));
    }else{
      if(callback) callback();
    }

    function newTagCreated(newTag:KNode, newTagEdge:KEdge){
      if(this.newTagIndex < this.newTags.length){
        this.usersProfilingService.createNewTag(this.newTags[this.newTagIndex++], newTagCreated.bind(this));
      }else{
        if(callback) callback();
      }
    }
  }


}
