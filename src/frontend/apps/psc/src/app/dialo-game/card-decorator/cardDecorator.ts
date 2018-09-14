import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';

export const enum DecoratorsRules{

}

export const enum CardDecoratorActions{
  SUPPORT,
  QUESTION,
  CHALLENGE,
  CONFLICT
  // UNITE //too demanding to implement for the PTW 2018
  /** DialoGame - Talkens
  https://docs.google.com/document/d/12Up-ix-5Al1gtMXgAz_v4Yt2MQF5RjK8KEG-L3tDiFw/edit:
  IDEA, SUPPORT, QUESTION, CONFLICT, RELATED, COMMIT, DO,
  */
}

export const enum CardDecoratorEmoticons{
  SUPPORT,
  QUESTION,
  CHALLENGE,
  CONFLICT
  // UNITE //too demanding to implement for the PTW 2018
  /** DialoGame - Talkens
  https://docs.google.com/document/d/12Up-ix-5Al1gtMXgAz_v4Yt2MQF5RjK8KEG-L3tDiFw/edit:
  IDEA, SUPPORT, QUESTION, CONFLICT, RELATED, COMMIT, DO,
  */
}

export const enum CardDecoratorRequests{
  SUPPORT,
  QUESTION,
  CHALLENGE,
  CONFLICT
  // UNITE //too demanding to implement for the PTW 2018
  /** DialoGame - Talkens
  https://docs.google.com/document/d/12Up-ix-5Al1gtMXgAz_v4Yt2MQF5RjK8KEG-L3tDiFw/edit:
  IDEA, SUPPORT, QUESTION, CONFLICT, RELATED, COMMIT, DO,
  */
}

export class CardDecorator{
  static decorators:any = {
    'actions':{
      // 'name':'Actions',
      'desc':'In which way you connect your card with the previous one',
      'img':'',
      'decorators':{
          /*{

            DISABLED FOR NOW
            'name':'Idea',
            'desc':'New idea',
            'img':'',
            },
            */
          'support':{
            'desc':'I support the previous card',
            'img':''
          },
          'question':{
            'desc':'A question for the next player',
            'img':''
          },
          'answer':{
            'desc':'Answer to the question',
            'img':''
          },
          'challenge':{
            'desc':'Challenge for the next player',
            'img':''
          },
          'conflict':{
            'desc':'Conflicting with the previous card',
            'img':''
          }
      }
    },


    'emoticons':{
      'desc':'what is the emotion of your card?',
      'img':'',
      'decorators':{
          'joy':{
            'desc':'',
            'img':'assets/images/emoticons/joy.jpg'
          },
          'fear':{
            'desc':'',
            'img':'assets/images/emoticons/fear.jpg'
          },
          'sadness':{
            'desc':'',
            'img':'assets/images/emoticons/sadness.jpg'
          },
          'anticipation':{
            'desc':'',
            'img':''
          },
          'disgust':{
            'desc':'',
            'img':''
          },
          'trust':{
            'desc':'',
            'img':''
          },
          'surprise':{
            'desc':'',
            'img':''
          },
          'anger':{
            'desc':'',
            'img':''
          }
      }
    },

    'requests':{
      'desc':'request for the player of the next card',

    }
  }

  static getDecorators(type:string=null):KNode[]{
    let decoratorCards:KNode[] = [];
    let location:any = CardDecorator.decorators;
    if(type){
      location = CardDecorator.decorators[type].decorators;
    }
    let card:KNode;
    for(var i in location){
      card = new KNode();
      card.name = i;//location[i];
      //card._id = '5b8bf3f23663ad0d5425e878' + i;
      //card.iAmId = '5b97c7ab0393b8490bf5263c';
      if(card.dataContent === null){ card.dataContent = {};}
      card.dataContent.desc = location[i].desc;
      card.dataContent.img = location[i].img;
      decoratorCards.push(card);
    }
    return decoratorCards;
  }

  public decorator:string;

  constructor(decorator:string){
    this.decorator = decorator;
  }
}
