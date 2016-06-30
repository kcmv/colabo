# Concepts

ViewSpec concepts originates from Douglas C. Engelbart and strongly relates to [global repository] concept and idea that visual representation and content should not be uniquely related. Quite on the contrary, each item can/should have multiple viewSpecs that provide different perspectives on the same item.

# Map viewSpec

Map, as an perspective or projection of a knowledge space, can have different viewSpecs that suits either particular moment, action, or person, just naming few reasons.

The KnAllEdge component currently provides two viewSpecs:

+ tree
+ manual

## viewSpecs management

set of all possible viewSpecs are managed by knalledge.MapManager class.

## viewSpecs structure

Each viewSpec consists at least of `layout` and `visualization` components.
