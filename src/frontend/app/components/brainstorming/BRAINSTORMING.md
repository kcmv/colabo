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
  + moderator has to have turned on **Presenter-mode**
  + moderator clicks on Tool/Brainstorming button
  + sets up new Brainstorming through the form
1. **Silent generation of ideas**
    + Each participant creates as much as possible `%IBIS% : Idea`-s that come to his mind when considering the question.
    + All ideas are **private** at this phase.
    + This phase lasts approximately _10 minutes_.
    + _**Notes. Open?**_
      + Active user or Logged In?
      + should we, after user creates an idea, select back the `%IBIS% : Question` for him?
      + should we forbid creation of nodes anywhere else but as children of the `%IBIS% : Question`? Or we should allow them to explain their ideas by adding `%IBIS% : Argument` to them? Or should they explain them through Node.property/data-content? Maybe we could allow everything but warn them that it is not direct part of brainstorming what they are doing (i.e. they want to their own notes as some nodes elsewhere, etc)
      + should we preset their nodes to be of type `%IBIS% : Idea`? and forbid changing node types? by hiding IBISTypesList? Or should users switch to %IBIS% Idea by themselves?
      + what about "follow presenter" button?
      + should we and How limit display of nodes to Question and ideas? By 'limit range' (it is broadcasted)?
      + maybe participant can also have **Broadcasting button**, that leads to the **Broadcasting panel** with:
        + button for selecting back the `%IBIS% : Question` if we are lost by navigating through the map while brainstorming
        + switch: 'showing only question and ideas' vs 'showing all the map'
        + maybe: button 'Add new idea' (especially useful phase 2)
        + what else? ...
      + should we forbid?
        + voting (at least of the brainstorming ideas)
        + filtering: show Ibis -> off
        +
    + **Current procedure**
      + we only see OUR children of the `%IBIS% : Question` (that we have provided through current state and decoration of nodes)
      + Brainstorming can be created only by a moderator
        1. He creates Brainstorming-Question (`%IBIS% : Question`) that must be selected
        2. Clicks Brainstorming button upon which (he is warned if no question is selected):
        + form is open
          + enables selecting timings per phase
          + shows Brainstorming-Question
      + to all participants is broadcasted Brainstorming object containing the following (with `->` we mark actions it causes):
        + brainstorming phase: 1
        + brainstorming question -> which pre-selects that node on all clients
1. **Sharing ideas**
    + Participants one by one present (make public) one by one of their ideas
    + There is **no debate about items** at this stage
    + Participants are encouraged to write down any **new ideas** that may arise from what others share.
    + This stage may take _15–30 minutes_
    + **Current procedure**
      + other participants that listen, they turn off navigation to be able to add ideas
      + we turn on Ontov filter for the current user to show ideas on screen
      + user can use Ontov filter to hide others ideas on their computers
    + _**Notes. Open?**_
        + how to go around users?
          + we can support round robin (token) guidance.
          + moderator can choose next presenter
        + Is it better for a presenter to show one by one idea?
        That is more difficult to implement, but can be achieved by changing decoration of ideas.
        (UI for this can be a decorator on the node)
        + how will we manage presenting and adding new ideas by listeners in parallel?
          + will presenter broadcast its navigation so that we follow him? If so, then listeners could add their ideas
            + by a dialog, like we add collaboration in MCM tool (without being disturbed/broken by presenter)
            + or by fixing that new nodes (ideas) are added to the Brainstorming-Question, no matter the selected node
        + Will new ideas made by listeners of a presenter be public or private?
            + not a big deal, what ever is easier to implement
        + :warning: There may be hundred(s) of sibling ideas!! How to manage them? Visual map is going to be disturbed!?! Participants will be lost in finding their ideas to present
1. **Group discussion**
    + `IBIS Dialog` - Participants are invited to **seek verbal explanation** or further details about any of the ideas that colleagues have produced that may not be clear to them.
    + The facilitator’s task is to ensure that each person is allowed to contribute and that discussion of all ideas is thorough without spending too long on a single idea.
    + It is important to ensure that the process is as **neutral** as possible, **avoiding judgment and criticism (no evaluative comments!)**.
    + The group may suggest **new items/ideas**  for discussion and combine items/ideas into **`categories`**, but **no ideas should be eliminated**.
    + This stage lasts _30–45 minutes_
    + _**Notes. Open?**_
        + !!! restructuring ideas into categories **could make voting more complicated!!**
1. **Voting and ranking**
    + This involves **prioritizing** the recorded ideas in relation to the original question.
    + Following the voting and ranking process, immediate results in the response to the question is available to participants so the meeting concludes having reached a specific outcome.
    + Voting can be done by **secret ballot**
    + **Current procedure**
      + participants give 3, 2, 1 votes for 1st, 2nd and 3rd rated idea

# NGT in Details

+ As compared to interacting groups the NGT groups provide more unique ideas, more balanced participation between group members, increased feelings of accomplishment, and greater satisfaction with idea quality and group efficiency
+ some members are reluctant to create **conflict** in groups. (Many people want to maintain a pleasant climate.) NGT overcomes these problems
+ Some of the **issues with NGT** is: Opinions may not converge in the voting process, cross-fertilization of ideas may be constrained
+ **Adaptation for ill-structured problems**
Modification of NGT, undertaken by Bartunek and Murnighan[13] , helps to deal with ill-structured problems. Normal ideas are generated and listed, followed by the facilitator questioning if the ideas are relevant to the same problem. If not, the problem is said to be ill-structured, and the ideas generated are clustered into coherent groups. These clusters of ill-structured ideas are then treated as problems in their own right, and the NGT procedure is applied to them. Regular breaks are taken by the participants to ensure that the group feels they are still working on the original problem.
