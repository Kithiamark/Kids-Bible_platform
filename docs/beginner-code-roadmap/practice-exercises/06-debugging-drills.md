# Exercise 06: Debugging Drills

## Goal

Practice debugging without random guessing.

## Drill 1

Imagine this function returns the wrong result:

```python
def is_passing_score(score: int, threshold: int) -> bool:
    return score > threshold
```

Questions:
- what happens when `score == threshold`
- what should happen
- what is the smallest fix

## Drill 2

A page shows no lessons.

Ask in order:
1. did the request fire
2. did the backend return data
3. did the page receive that data
4. did rendering fail

## Drill 3

You get a 401 response.

Check:
- is the token stored
- is the request header sent
- is the token valid
- is the route protected for the wrong role

