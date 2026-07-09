# How To Make Code Work

Making code work is not magic.

It is usually a process of:
- understanding the expected behavior
- running the code
- comparing expectation to reality
- reading the error or output
- checking one thing at a time

## The Biggest Beginner Mistake

The biggest mistake is changing many things at once.

When you do that, you no longer know:
- what caused the bug
- what fixed the bug
- what broke something else

## The Calm Debugging Loop

Use this loop:

1. say what you expected
2. say what actually happened
3. find the smallest place where they differ
4. inspect inputs there
5. inspect outputs there
6. make one change
7. run again

That is debugging.

## Read Errors Properly

When an error appears, do not only look at the scary part.

Read for:
- file name
- line number
- function name
- exact error type
- bad value or missing value

Example questions:
- is this value `None` when I expected a string
- is this ID missing
- am I calling the wrong endpoint
- did I pass the wrong shape

## Print, Log, Inspect

If you do not understand the state, inspect it.

Examples:

```python
print("attempt_id:", attempt_id)
print("submission:", submission)
```

```ts
console.log("lessonId", lessonId)
console.log("response", response.data)
```

Do not leave noisy debugging output everywhere forever, but use it while learning.

## What To Check First

When something fails, check in this order:

1. is the code running the file/function I think it is
2. did the input arrive correctly
3. did validation reject it
4. did a dependency fail
5. did I misunderstand the expected output

## Frontend Debugging Questions

If the UI is wrong, ask:

- did the page fetch the data
- did the API request succeed
- did state update
- did the component receive the right props
- is the route correct

Useful files in this repo:
- [App.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/App.tsx)
- [api.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts)
- [authStore.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/store/authStore.ts)

## Backend Debugging Questions

If the API is wrong, ask:

- did the request reach the correct route
- did auth fail
- did validation fail
- did the service logic behave correctly
- did the DB query return what I expected

Useful files in this repo:
- [main.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/main.py)
- [security.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py)
- [quiz_service.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/quiz_service.py)

## Debugging By Layers

When debugging a full-stack feature, check one layer at a time.

Example:
- click button
- browser sends request
- backend route receives request
- service performs logic
- DB changes
- response returns
- UI updates

If you check all of that at once, it feels impossible.
If you check one layer at a time, it becomes manageable.

## Good Beginner Rule

Never say:
- "it does not work"

Instead say:
- "the request returns 401"
- "the function returns `None`"
- "the score is calculated incorrectly when max points is zero"
- "the page loads but state does not update"

Specific observations lead to real fixes.

## Before Changing Code, Ask

- what exactly is broken
- where do I expect the truth to be
- what evidence do I have
- what is the smallest change I can try

That is how you stop guessing.

