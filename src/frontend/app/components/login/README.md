[example of redirecting login](http://localhost:5555/#/login/route/map%2Fid%2F56e8b66b913d88af03e9d17f)

it has to be encoded with urlEncode, but also before that, it has to replace / with `___` because otherwise Angular will interprete it back as

[example of redirecting login](http://localhost:5555/#/login/route/map___id___56e8b66b913d88af03e9d17f)

http://localhost:5555/#/map/id/56e8b66b913d88af03e9d17f
http://localhost:5555/#/map/id/56ea1ca84903f47d3fe00dd8

# User types

## Logged in user

## Active user
It is a user that moderator switched to, in order to update knowledge on the behalf of the active user.

By default, active user is same as logged in user, and for non-moderator, this is not possible to change.

# update knalledge.KMap with active user

This is most likely a workaround before a more serious AAA mechanism

## Logged in user
