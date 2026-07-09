# How To Think Like a Programmer

Being a programmer is not mainly about memorizing syntax.

It is about:
- breaking problems into smaller pieces
- being precise
- checking your assumptions
- building one step at a time

## What “Vibe Coding” Usually Looks Like

Vibe coding is when you:
- keep changing things without knowing why
- paste code you do not understand
- hope the next edit magically fixes everything
- skip reading the error
- skip planning because you want speed

That feels productive for a few minutes, but it usually creates confusion.

## What Good Coding Looks Like Instead

Good coding looks slower at first:

1. understand the goal
2. break it into steps
3. decide where each step belongs
4. write a small amount of code
5. run it
6. inspect what happened
7. fix one thing at a time

That is not slow in the long run. It is how you avoid chaos.

## The Problem-Breaking Habit

If the task is:
- "Students should be able to submit a quiz"

Do not jump straight to code.

Break it down:

1. how does the frontend send answers
2. which backend endpoint receives them
3. how does the backend find the attempt
4. how does it check the quiz matches
5. how does it compare answers
6. how does it calculate score
7. how does it save results
8. what should it return

Now the task is understandable.

## Plain-English First

Before coding, explain the behavior in plain English.

Example:

- A student submits answers for an existing attempt.
- The system checks the attempt exists and is not already complete.
- The system grades each answer.
- The system calculates the total score.
- The system marks the attempt complete.
- If the student passed, points are awarded.
- The response includes score and answer results.

If you cannot explain it simply, you usually are not ready to code it cleanly.

## The Three Questions To Ask Before Writing Code

Ask:

1. What should happen?
2. Where should this logic live?
3. How will I know it works?

Those three questions prevent a lot of beginner mistakes.

## The “One Job” Rule

When looking at a function or file, ask:

- What is its one main job?

If the answer is:
- "it validates input, queries the DB, formats a response, updates points, logs activity, and sends a message"

then that is probably too much.

## Think In Inputs and Outputs

Every function should have:
- input
- work
- output

Example:

```python
def is_passing_score(score: float, threshold: float) -> bool:
    return score >= threshold
```

This is easy to understand because:
- input: `score`, `threshold`
- work: compare them
- output: `True` or `False`

## Learn To Love Small Steps

If something feels too hard, make it smaller.

Instead of:
- "build the whole feature"

do:
- "render the button"
- "capture the click"
- "send the request"
- "handle success"
- "handle failure"

That is how real features get built.

## A Good Daily Habit

Whenever you open a file, answer these:

- What problem is this file solving?
- Who uses this file?
- What data comes in?
- What data goes out?
- What does not belong here?

That habit trains your brain to think structurally.

