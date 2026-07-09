# How To Write Tests

A test is a small piece of code that checks whether your code behaves the way you expect.

Tests are useful because they answer:
- does this work
- does it still work after changes
- what happens in bad cases, not only good ones

## What A Test Case Is

A test case is one specific scenario.

Example:
- "If a student gets 8 out of 10 and the passing score is 70, they should pass."

That is one test case.

Another test case:
- "If the quiz attempt is already completed, submission should fail."

Good tests are concrete.

## The Three Basic Kinds of Test Cases

### Happy Path

The normal successful case.

Examples:
- valid login works
- valid quiz submission returns a score
- valid lesson creation saves correctly

### Failure Case

The code should reject something or fail safely.

Examples:
- wrong password
- missing token
- invalid ID
- quiz already completed

### Edge Case

A less common case that still matters.

Examples:
- zero total points
- max attempts reached exactly
- empty list
- unexpected but valid value boundaries

## How To Decide What To Test

Test the parts that matter most:

- business rules
- scoring
- permission checks
- validation
- calculations
- things that are easy to break during refactoring

Do not start by testing everything.
Start by testing important behavior.

## Beginner Formula For Writing A Test

Think in three parts:

1. arrange
2. act
3. assert

That means:

1. set up the data
2. run the function or request
3. check the result

Example:

```python
def test_is_passing_score():
    score = 80
    threshold = 70

    result = score >= threshold

    assert result is True
```

## What To Test In This Repo

### Authentication

Good test cases:
- valid login returns tokens
- invalid password fails
- student login with wrong parent email fails
- inactive user cannot authenticate

Example test file:
- [test_auth.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/tests/test_auth.py)

### Quiz Submission

Good test cases:
- valid answers produce the right score
- attempt not found returns 404
- already completed attempt returns 400
- wrong quiz id in submission returns 400
- passed quiz awards points
- failed quiz does not award points

Main code:
- [QuizService.submit_quiz](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/quiz_service.py#L126-L211)

### Permissions

Good test cases:
- admin can access admin routes
- teacher can access teacher routes
- parent cannot access admin-only route
- student-only route rejects user token

Related code:
- [security.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L71-L171)

## A Good Beginner Test Question

Before writing a test, ask:

- what promise is this code making

Example:
- "This function promises to reject already completed quiz attempts."

That promise should have a test.

## Bad Beginner Testing Habits

- testing trivial things that almost cannot fail
- writing tests without understanding the feature
- copying tests without knowing what they prove
- checking too many things in one test
- not naming the test clearly

## Good Test Names

Bad:
- `test_quiz`
- `test_thing`

Better:
- `test_submit_quiz_rejects_completed_attempt`
- `test_login_returns_tokens_for_valid_credentials`

The name should say what behavior is being checked.

## What Goes Where In Tests

Put tests close to the area they cover in meaning, even if the test file is separate.

Examples in this repo:
- auth behavior: [backend/tests/test_auth.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/tests/test_auth.py)
- lesson behavior: [backend/tests/test_lessons.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/tests/test_lessons.py)
- route/role behavior: [backend/tests/test_teacher_routes.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/tests/test_teacher_routes.py)

## Beginner Testing Checklist

Before you say a feature is done, ask:

- did I test the happy path
- did I test one failure path
- did I test one edge case if relevant
- does the test name explain the behavior
- does the test prove something meaningful

