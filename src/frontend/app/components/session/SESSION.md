Session

# Introduction

Sessions are existing per map.
They are defined by their id, containing
 + mapId
 + relativeSessionId

if there is no a session for a map joined by a user, each user, viewing that map is joined to a **default session**.
Moderators can create a new session (_Q1_).

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
