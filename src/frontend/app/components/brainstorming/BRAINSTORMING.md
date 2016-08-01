Brainstorming

_**Nominal Group Technique**_

# About

+ The nominal group technique (NGT) is a group process involving problem identification, solution generation, and decision making.
+ First, every member of the group gives their view of the solution, with a short explanation. Then, duplicate solutions are eliminated from the list of all solutions, and the members proceed to rank the solutions, 1st, 2nd, 3rd, 4th, and so on.
+ This diversity often allows the creation of a hybrid idea (combining parts of two or more ideas), often found to be even better than those ideas being initially considered.
+ In the basic method, the numbers each solution receives are totaled, and the solution with the highest (i.e. most favored) total ranking is selected as the final decision.

# Phases

1. **Brainstorming Creation** :
  + `%IBIS% : Question` to be brainstormed about is created by moderator
  + the question has to be selected
  + moderator clicks on Tool/Brainstorming button
  + moderator is warned if not in the **Presenter-mode**
  + sets up new Brainstorming through the form
  + to all participants is broadcasted Brainstorming object containing the following (with `->` we mark actions it causes):
    + brainstorming phase: 1
    + brainstorming question -> which pre-selects that node on all clients
1. **Silent generation of ideas**
    + Each participant creates as much as possible `%IBIS% : Idea`-s that come to his mind when considering the question.
    + All ideas are **private** at this phase.
    + This phase lasts approximately _10 minutes_.
    + _**Notes. Open?**_  
      + what about "follow presenter" button? Should we hide it, not to disturb particpants during BS
        + hmm, maybe not, because they sometimes should be navigated and will have "back to question" button anyway - BUT **problem** may occur if they start to create a node, and just before that they are navigated to some other node by a presenter
      + should we and How limit display of nodes to Question and ideas? By 'limit range' (it is broadcasted)?
          + **@mprinc:** i would only limit to the question subtree (ontov already supports that, but based on node name, so if there are two nodes with same name, both will be visible), and make it possible to show whole map with switch
      + should we forbid?
        + voting (at least of the brainstorming ideas)
            + **@mprinc:** surely nice to support, but not now, if we TELL them not to, it will be fine :), especially because they will not know about it BEFORE we tell them :) We need to focus to user experience and comfort (guidance) now, and not on constraints.
        + filtering: show Ibis -> off, so that don't accidentally hide brainstorming?
            + maybe not, but we can warn them in the case of trying that
    + **Our procedure**
      + we only see OUR children of the `%IBIS% : Question` (that we have provided through current state and decoration of nodes)
        + Ideas privacy is checked against the Active user (active and not loggedIN, so that moderator can check others' ideas)
      + we allow adding of IDEAS under BS-Question and adding arguments as children of these ideas. If user wants to create a node outside of these 2 locations, CF will warn him and ask for a confirmation.
        + this way they can e.g add their own notes at some nodes elsewhere, in BS-mode
      + when we're on `%IBIS% : Question` + we're in this phase of Brainstorming -> new node type is automatically set to`%IBIS% : Idea`
      + when we're on an `%IBIS% : Idea` + we're in this phase of Brainstorming -> new node type is automatically set to `%IBIS% : Argument`
1. **Sharing ideas**
    + Participants one by one present (make public) one by one of their ideas
    + There is **no debate about items** at this stage
    + Participants are encouraged to write down any **new ideas** that may arise from what others share.
    + This stage may take _15–30 minutes_
    + **Current procedure**
      + moderator chooses presenter one by one
      + presenter has button 'Present Next Idea' wthich make visible one by one idea and navigate to it
      + for other participants `session::mustFollowPresenter` is turned on so that they MUST follow presenter's ideas
        + see how will they be able then to add new ideas in this phase (If we allow them too?!)
      + we use **Ontov filter** to filter only the presenter to show only his ideas to everywhone
    + _**Notes. Open?**_
        + how to go around users?
          + we can support round robin (token) guidance.
          + moderator can choose next presenter
          + Because presenter broadcast its navigation so that we follow him, listeners could add their ideas
            + by a dialog, like we add collaboration in MCM tool (without being disturbed/broken by presenter)
            + or by fixing that new nodes (ideas) are added to the Brainstorming-Question, no matter the selected node
            + but adding new ideas in sharing ideas phase could prevent other to listen to presenter ?!
        + Will new ideas made by listeners of a presenter be public or private?
            + not a big deal, what ever is easier to implement
1. **Group discussion**
    + `IBIS Dialog` - Participants are invited to **seek verbal explanation** or further details about any of the ideas that colleagues have produced that may not be clear to them.
    + The facilitator’s task is to ensure that each person is allowed to contribute and that discussion of all ideas is thorough without spending too long on a single idea.
    + It is important to ensure that the process is as **neutral** as possible, **avoiding judgment and criticism (no evaluative comments!)**.
    + The group may suggest **new items/ideas**  for discussion and combine items/ideas into **`categories`**, but **no ideas should be eliminated**.
    + This stage lasts _30–45 minutes_
    + _**Notes. Open?**_
        + !!! restructuring ideas into categories **could make voting more complicated!!**
        + support adding **questions** to ideas which triggers idea creator to answer them. This is important for dislocated Brainstorming
        + add switch "show only my ideas" - to filter them especially to see questions and comments (here **Ontov filter** will be used)
        + we would need to **improve navigation through big amount of (sibling) nodes**, like at this case, through many ideas:
          + we could add **Navigation panel**, with 4 buttons: `<<  <  > >>` for navigation through sibling nodes (ideas)
          + also to see how to improve **seeing of all available nodes** when discussing (P4) and voting (P5)
1. **Voting and ranking**
    + This involves **prioritizing** the recorded ideas in relation to the original question.
    + Following the voting and ranking process, immediate results in the response to the question is available to participants so the meeting concludes having reached a specific outcome.
    + Options:
      + Order nodes by voting score: 1) overall sum, 2) differences in positive.vs negative
    + Voting can be done by **secret ballot**
    + **Questions**
      + ..
    + **Current procedure**
      + participants give 3, 2, 1 votes for 1st, 2nd and 3rd rated idea
      + enable easier voting management:
        + **Ontov Filter** to filter ideas by 'number of votes' threshold
          + users can have a selector to choose the threshold
    + _**Notes. Open?**_
      + do not show total votes at this phase - to avoid influence; only yours
1. **Finish**
    + **Ontov Filter** to filter ideas by 'number of votes' threshold
      + users/moderator can have a selector to choose the threshold
    + Statistics
      + most active authors
      + author with best voted ideas
    + results
      + highest voted ideas
      +

# More about our implementation
## Brainstorming toolbar
It should contain
  + button for selecting back the `%IBIS% : Question` if we are lost by navigating through the map while brainstorming
  + switch: 'showing only question and ideas' vs 'showing all the map'
  + maybe: button 'Add new idea' (especially useful phase 2)
  + what else? ...

# NGT in Details

+ As compared to interacting groups the NGT groups provide more unique ideas, more balanced participation between group members, increased feelings of accomplishment, and greater satisfaction with idea quality and group efficiency
+ some members are reluctant to create **conflict** in groups. (Many people want to maintain a pleasant climate.) NGT overcomes these problems
+ Some of the **issues with NGT** is: Opinions may not converge in the voting process, cross-fertilization of ideas may be constrained
+ **Adaptation for ill-structured problems**
Modification of NGT, undertaken by Bartunek and Murnighan[13] , helps to deal with ill-structured problems. Normal ideas are generated and listed, followed by the facilitator questioning if the ideas are relevant to the same problem. If not, the problem is said to be ill-structured, and the ideas generated are clustered into coherent groups. These clusters of ill-structured ideas are then treated as problems in their own right, and the NGT procedure is applied to them. Regular breaks are taken by the participants to ensure that the group feels they are still working on the original problem.

# Temporal solutions. Workarounds. Required to be addressed better in the future. Especially, regarding 'Behavioral Grammars'

+ knalledgeMap should access BS state through interface and not through policyConfig?
+ nodes have node.kNode.decorations.brainstorming
  + is it OK to decorate them like that? or this informations should be gained based on their context?
  (instead of using decorations for hiding ideas "Silent generation of ideas", we could say: if BS.state = 1 and this node is child of BS.Question & is of type.IDEA and creator !=active user: HIDE it)
+ MapStructure.prototype.nodeDecoration can be god example of **Behavioral Grammar** driven approach: it says, I am creating a node, please decorate it, give me your actions to include your decorations based on your states.
+ so far, at node creation, we decorate it with the current brainstorming phase
