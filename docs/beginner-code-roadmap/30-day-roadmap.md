# 30-Day Beginner Roadmap

This roadmap is for learning how to write code that is clear, structured, and reliable.

The goal is not to become “advanced” in 30 days.

The goal is to become the kind of beginner who:
- understands what they are writing
- can make small things work
- knows where code belongs
- does not panic when something breaks
- starts building with intention instead of guessing

## Ground Rules For The 30 Days

- Code every day, even for 20-40 minutes.
- Read code every day.
- Run your code every day.
- Do not skip debugging.
- Do not copy big blocks of code you do not understand.
- If something is confusing, shrink the problem until it becomes understandable.

## Week 1: Learn How Code Is Built

### Day 1
- Read [START_HERE.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/beginner-code-roadmap/START_HERE.md)
- Read [how-to-think-like-a-programmer.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/beginner-code-roadmap/how-to-think-like-a-programmer.md)
- Exercise: write down what a variable, function, condition, loop, and object are in your own words
- Exercise: explain what [main.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/main.py) is responsible for

### Day 2
- Read [how-to-structure-code.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/beginner-code-roadmap/how-to-structure-code.md) up to the backend section
- Study [backend/overview.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/wiki/backend/overview.md)
- Exercise: make a table with these columns: file, job, what should not go here

### Day 3
- Study [App.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/App.tsx)
- Read [frontend/routing.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/wiki/frontend/routing.md)
- Exercise: list every route group and what kind of user it serves

### Day 4
- Study [api.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts)
- Study [backend/api.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/wiki/backend/api.md)
- Exercise: trace one request from frontend to backend, for example login or quiz submission

### Day 5
- Study [authStore.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/store/authStore.ts)
- Study [security.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py)
- Exercise: explain the difference between authentication and authorization

### Day 6
- Read [how-to-make-code-work.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/beginner-code-roadmap/how-to-make-code-work.md)
- Exercise: pick one small bug or confusing behavior in any simple sample code and write out:
  - what you expected
  - what happened
  - what you checked
  - what you learned

### Day 7
- Weekly review
- Write one page in your notes:
  - what is a route
  - what is a schema
  - what is a service
  - what is a model
  - what is a component

## Week 2: Learn To Write Clear Code

### Day 8
- Read [how-to-think-like-a-programmer.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/beginner-code-roadmap/how-to-think-like-a-programmer.md) again
- Exercise: take a messy idea like “submit quiz” and break it into 5-8 steps in plain English

### Day 9
- Study [quiz_service.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/quiz_service.py)
- Exercise: identify where validation happens, where grading happens, and where DB updates happen

### Day 10
- Practice function writing in a small scratch file
- Write 3 small functions:
  - calculate total score
  - check if user is allowed
  - format a message
- Rule: each function does one job only

### Day 11
- Read the frontend page guide: [frontend/pages.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/wiki/frontend/pages.md)
- Exercise: choose one page and explain:
  - what it displays
  - what data it fetches
  - what should stay outside this page

### Day 12
- Practice naming
- Rename 10 imaginary bad names into good names:
  - `data`
  - `handleThing`
  - `temp`
  - `value2`
  - `stuff`
- Explain why the better names are better

### Day 13
- Read the backend core guide: [backend/core.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/wiki/backend/core.md)
- Exercise: explain why config, database setup, and security are separated into their own folder

### Day 14
- Weekly review
- Mini task: write a tiny feature on paper first
  - for example “mark lesson as favorite”
- Decide where each part would go:
  - route
  - schema
  - service
  - model

## Week 3: Learn To Debug And Test

### Day 15
- Read [how-to-write-tests.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/beginner-code-roadmap/how-to-write-tests.md)
- Learn the terms:
  - happy path
  - edge case
  - failure case
  - regression

### Day 16
- Open one backend test file such as [test_auth.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/tests/test_auth.py)
- Exercise: explain in plain English what each test is trying to prove

### Day 17
- Write your own simple test in a scratch file for a small function
- Example function ideas:
  - `is_passing_score(score, threshold)`
  - `format_student_name(name)`
  - `can_retry_quiz(attempts, max_attempts)`

### Day 18
- Read [how-to-make-code-work.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/beginner-code-roadmap/how-to-make-code-work.md) again
- Exercise: intentionally break a tiny function and practice reading the error message carefully

### Day 19
- Study [quiz_service.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/quiz_service.py#L126-L211)
- Exercise: list the test cases needed for quiz submission
  - successful submit
  - wrong quiz id
  - already completed
  - missing question
  - pass/fail scoring

### Day 20
- Study one API endpoint file and one test file together
- Exercise: match behavior in the endpoint to the tests that should exist

### Day 21
- Weekly review
- Write a checklist called “Before I say it works”
  - did I run it
  - did I test the main path
  - did I test a bad input
  - did I read the output
  - did I check naming and placement

## Week 4: Build Small Things Properly

### Day 22
- Design a tiny feature
- Good beginner examples:
  - add a helper function
  - add a simple endpoint
  - add a simple component
  - add validation to an existing form

### Day 23
- Write the plan before the code
- Use this format:
  - what should happen
  - inputs
  - outputs
  - where code should go
  - what could go wrong

### Day 24
- Implement only the smallest working slice
- Do not try to finish everything at once

### Day 25
- Test that slice
- Write at least:
  - one happy path check
  - one failure path check

### Day 26
- Refactor after it works
- Ask:
  - can I name this better
  - can I split this function
  - is this file doing too much

### Day 27
- Study [dependencies.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/wiki/dependencies.md)
- Exercise: draw your feature’s dependency path from UI to DB or from request to response

### Day 28
- Review a real file from this repo and pretend you are the maintainer
- Write:
  - what is good
  - what feels crowded
  - what you would keep
  - what you would improve later

### Day 29
- Re-read:
  - [how-to-structure-code.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/beginner-code-roadmap/how-to-structure-code.md)
  - [how-to-write-tests.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/beginner-code-roadmap/how-to-write-tests.md)
- Write your own “clear code rules” list with 10 rules

### Day 30
- Final review
- Answer these questions honestly:
  - Can I explain what a service is?
  - Can I decide where code belongs?
  - Can I debug one issue without random edits?
  - Can I write one useful test case?
  - Can I build one small feature with a plan first?

## If You Finish Early

Repeat the cycle with one small real feature:

1. describe the problem
2. decide where code goes
3. write the smallest version
4. run it
5. test it
6. refactor it

That cycle is how real programmers improve.

## Use The Second Layer Alongside This Plan

As you go through the 30 days, use these extra materials:

- Extra drills: [practice-exercises/INDEX.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/beginner-code-roadmap/practice-exercises/INDEX.md)
- Guided builds: [mini-projects/INDEX.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/beginner-code-roadmap/mini-projects/INDEX.md)
- Self-review tools: [review-checklists/INDEX.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/beginner-code-roadmap/review-checklists/INDEX.md)
- Reusable worksheets: [templates/INDEX.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/beginner-code-roadmap/templates/INDEX.md)
- Slow repo walkthroughs: [worked-examples/INDEX.md](file:///c:/Users/USER/Project/Kids-Bible_platform/docs/beginner-code-roadmap/worked-examples/INDEX.md)
