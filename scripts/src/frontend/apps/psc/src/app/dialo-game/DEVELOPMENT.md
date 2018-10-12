# DialoGame - Development

# Suggesting Cards from other players

## Service Procedure

[@beviah](https://github.com/beviah)'s **SIMILARITY_SERVICE**

**GitHub**: "SIMILARITY_SERVICE for CWCs" https://github.com/Cha-OS/colabo/issues/350

- by the TASK IN QUEUE [@beviah](https://github.com/beviah) 's service gets
  - **AID** (i.e. **_id** of the user for which he will suggest similar cards);
  - **MAP_ID** (actual map)
  - **PLAY_ROUND** (**the finished - actual round** of the game)
- Then the service extracts INPUT:
  - extract cwc cards of the user:
    - **knodes** from the DB where the {mapId == MAP_ID} && {iAmId == AID} && {type == 'topiChat.talk.chatMsg'} (**Note**: ⚠️ so we don't care for now if some or these card's already played)
  - extracts cwc cards of other users (that they played in the last move):
    - **knodes** from the DB where the {mapId == MAP_ID} && {iAmId != AID} && {type == 'topiChat.talk.chatMsg'} && {dataContent.dialoGameReponse.playRound == PLAY_ROUND}
    - ⚠️ **take care!**: **dataContent** might not exist and **dataContent.dialoGameReponse**doesn't also exist if the cwcMsg is still not uses as a response in the DialoGame!
- Then the service **PROCESSES** data and calculates similarity
- Then the script stores the **OUTPUT** into the DB:
  - list of up to 5 suggested CWCs (we will show them just 3, but better to have more) with attached similarity quotient
  - ⚠️ TAKE CARE: there might be less than 5 users, so you provide most you can up to 5 ;)
  - format of the data: **list** of 5 elements in the format {cwc_card._id, similarity_quotient}
  - output data the list is stored by creating a new knode
    - node.type = 'service.result.dialogame.cwc_similarities';
    - node.mapId = MAP_ID
    - node.dataContent.result = {suggestions : list, playRound : PLAY_ROUND}
    - node.iAmId = AID

## Frontend <-> Backend Procedure

- [@sinisarudan](https://github.com/sinisarudan) - moderator-panel - insight: everybody played response card?
- invoke [@beviah](https://github.com/beviah) SIMILARITY_SERVICE
- ⚠️ it should invoke for everybody in the list (who finished the current round).
  - to see with [@mprinc](https://github.com/mprinc) how to do this in async mode
- [@mprinc](https://github.com/mprinc) getting all results from [@beviah](https://github.com/beviah) SIMILARITY_SERVICE
- in the moderator panel - increasing play round
- [@mprinc](https://github.com/mprinc) : topiChat: syncing - sends everybody the new round
- [@sinisarudan](https://github.com/sinisarudan) dialoGameService subscribed on changes in DialoGameState reacts on received round-change
- [@sinisarudan](https://github.com/sinisarudan) gets and displays suggested cards as challenge cards
- [@sinisarudan](https://github.com/sinisarudan) : continue with the next steps after the suggested card is selected