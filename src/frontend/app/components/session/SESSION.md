Session

# Introduction

Sessions are important to **enforce persistent / trusted / synchronized mutual/joint state of all participants** especially when we are **NOT physically present with participants/students**

Sessions are existing per map.
They are defined by their id, containing

 + mapId
 + relativeSessionId

if there is no a session for a map joined by a user, each user, viewing that map is joined to a **default session**.
Moderators can create a new session (_Q1_).

# Parameters

## Participants
+ session helps to keep track of participants in the session
+ for that, each session contain list of `Participant` instances, each representing a participant in the session.
+ by it, moderator/fascilitator can now:
  + who are active/online users in the session
  + what is the last action of each participant
  + where is each participant in the map

## Presenter
+ session takes care of current Presenter

# Session persistence
+ Sessions are used to enforce and keep persistence of manners/rules/behaviours (brainstorming, etc) participants are practicing
+ thus, sessions are stored on server
+ they contain behaviours (e.g. brainstorming) and preserve THEM TOO by that!
+ if any user is dropped of a session/connection, upon coming back he is set-up back to current state
+ if session-creator (moderator) has to restart or for some other reason loose application state, he can load the session from the server and continue enforcing it to session participants

# Questions

+ (**Q1**) Should we enable each user to create new session for which he would become **moderator** and be able to grant other users with moderator privilege?
  + By that we should review which privileges moderators have:
    + deleting that map
    + adding another users to the map
    + etc
+ (**Q2**) How to decorate users in Rima user List?
  + online
  + online in this session
  + all of them are in the map, by default
+ (**Q3**) Session persistence? Are sessions sessionless?
  + it is important to store it because even Session-creator can loose connection or have to restart the browser
+ who is excluded from readOnly: boolean?
  + moderator?
  + presenter?
+ we should think more of Session.collaboSpace, that is suppose to preserve actual state of all relevant puzzles in the Collabospace, behaviours, like a state in KnalledgeMapPolicyService
  + here behaviours like Brainstorming would be persistent and thus enforced to users that drop off conection etc, without need to send all behaviours by themselves
+ Should we provide multiple presenters per map?
 - so that you can choose which one to follow
 - or should in that case that other presenter open another session?
