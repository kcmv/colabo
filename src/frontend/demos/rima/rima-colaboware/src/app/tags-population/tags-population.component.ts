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
  {
    "tagsGroups": [
      {
        "name": "Diversity Background",
        "parentTagsGroup": null,
        "image": {
          "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuuUi6NLEdnBBJxtgrclUt2o5orAvHNc79vV01mfr39wtF_6Hq"
        }
      },
      {
        "name": "Interests",
        "parentTagsGroup": null,
        "image": {
          "url": "https://thumbs.dreamstime.com/z/woman-favorite-interests-dream-head-process-vector-flat-line-illustration-thought-what-women-wanted-idea-desire-wish-73352797.jpg"
        }
      },
      {
        "name": "Interest Helping",
        "parentTagsGroup": "Interests",
        "image": {
          "url": "https://thumbs.dreamstime.com/z/woman-favorite-interests-dream-head-process-vector-flat-line-illustration-thought-what-women-wanted-idea-desire-wish-73352797.jpg"
        }
      },
      {
        "name": "Interest 2",
        "parentTagsGroup": "Interests",
        "image": {
          "url": "https://thumbs.dreamstime.com/z/woman-favorite-interests-dream-head-process-vector-flat-line-illustration-thought-what-women-wanted-idea-desire-wish-73352797.jpg"
        }
      }
    ],
    "tags": [
      {
        "name": "Art",
        "tagGroup": "Diversity Background",
        "image": {
          "url": "https://images.fineartamerica.com/images-medium-large-5/hummingbird-of-watercolor-rainbow-olga-shvartsur.jpg"
        },
        "coLaboWareData": {
            "type": 1,
            "value": "0009876540"
        }
      },
      {
        "name": "Refugee",
        "tagGroup": "Diversity Background",
        "image": {
          "url": "http://www.refugeesarewelcome.org/wp-content/uploads/2016/04/RS4622_jordan2012jeffrey-2675-copy.jpg"
        },
        "coLaboWareData": {
            "type": 1,
            "value": "0009876541"
        }
      },
      {
        "name": "Hunger",
        "tagGroup": "Interest Helping",
        "image": {
          "url": "https://i.ndtvimg.com/i/2015-12/hunger-problem-india-istock_650x400_51449064006.jpg"
        },
        "coLaboWareData": {
            "type": 1,
            "value": "0009876551"
        }
      },
      {
        "name": "Health",
        "tagGroup": "Interest Helping",
        "image": {
          "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4LkCy_p_YLkdBbYNjbXB-KVHkwUgLNjZ2Ow6BOrWjyHp8Dchu"
        },
        "coLaboWareData": {
            "type": 1,
            "value": "0009876552"
        }
      }
    ]
  }
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
