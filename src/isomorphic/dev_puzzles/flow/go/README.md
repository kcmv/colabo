# Intro

`@colabo-flow/i-audit` is a ***i-colabo.space*** puzzle.

Puzzle describing structures for ColaboFlow auditing.

# Concepts Explanation

Each action belongs to a **user** (with ***userId***) (even if anonymous, or behind a particular IP, etc, depending on the resolution mechanism).

Each user starts a **session**  (with ***sessionId***) when (s)he accesses the system, and it lasts for that particular period of interaction with the system. It is up to the user, client application and the system to decide when/how session starts and ends.

During the session, client asks the system (on the behalf of the user) for different type, set and amount of work to be fulfilled. Each uniquely identified **work** with meaningful start and the end of the work is recognized as a flow, or process that is performed.

That work can be described with a **flow** enumerating set of **actions** performed in order to fulfill the work.

There is difference between a flow and instance of the flow. **Flow** describes a type of a work, a type of activities executed in order to fulfil a type of the work. For example, work of cutting the bread is a flow, consisting of activities: get the bread, get the knife, cut the bread. Each flow type is identified with *flowId*. 

Each time we are cutting the bread, we are performing the work explained with the flow, and each concrete performance of the flow is the **flow instance**. The istance is identified with *flowInstanceId*.

-----

This puzzle is automatically created with the [colabo tools](https://www.npmjs.com/package/@colabo/cli)