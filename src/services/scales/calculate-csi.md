```json
{
    "individual": [
        {
            "biased_collaboration": 20.0,
            "biased_effort": 0.0,
            "biased_enjoyment": 26.666666666666668,
            "biased_exploration": 26.666666666666668,
            "biased_expressiveness": 5.333333333333333,
            "biased_immersion": 13.333333333333334,
            "csi_overall": 92.0,
            "email": "user@mail.com",
            "input_collaboration": 100.0,
            "input_effort": 80.0,
            "input_enjoyment": 100.0,
            "input_exploration": 80.0,
            "input_expressiveness": 80.0,
            "input_immersion": 100.0
        },
    // ...
    ],
    "total": {
        "biased_collaboration": 14.25,
        "biased_effort": 10.916666666666666,
        "biased_enjoyment": 17.916666666666668,
        "biased_exploration": 16.083333333333332,
        "biased_expressiveness": 10.916666666666666,
        "biased_immersion": 9.083333333333334,
        "csi_overall": 79.16666666666666,
        "input_collaboration": 83.75,
        "input_effort": 77.5,
        "input_enjoyment": 82.5,
        "input_exploration": 73.75,
        "input_expressiveness": 78.75,
        "input_immersion": 72.5,
        "rank_collaboration": 2.6875,
        "rank_effort": 2.0625,
        "rank_enjoyment": 3.1875,
        "rank_exploration": 3.25,
        "rank_expressiveness": 2.0625,
        "rank_immersion": 1.75
    }```

```js
email is unique id
input_collaboration, ... are in range [0, 100]
(biased_collaboration + biased_effort + biased_enjoyment + biased_exploration + biased_expressiveness + biased_immersion) in range [0, 100]
csi_overall in range [0, 100]
rank_collaboration are in range [0..5]
(rank_collaboration + rank_effort + rank_enjoyment + rank_exploration + rank_expressiveness + rank_immersion) == 15
```
