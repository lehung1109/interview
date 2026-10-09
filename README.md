
## Usage

### For Interviewers

Start with [the practical exercise index and question bank](common.md), which includes runnable exercises, target levels, expected answers, evaluation criteria, time estimates, and follow-up questions. The first three new exercise pairs are runnable; the remaining conversions are explicitly marked as not implemented.

Use [Accessibility](accessibility-questions.md), [Security](security-question.md), [DevOps](devops-question.md), and [SEO](seo-question.md) for role-specific deep dives. These specialist banks are prompts, not complete scoring rubrics; select questions and agree on expected answers before the interview. Do not require a particular cloud platform or specialist topic unless the job needs it.

Suggested 60-minute interview:

| Time | Activity |
| --- | --- |
| 5 minutes | Establish context and explain the exercise requirements. |
| 25 minutes | Discuss 4-6 questions selected for the role. |
| 20 minutes | Complete one practical exercise with explicit acceptance criteria. |
| 10 minutes | Discuss trade-offs, a past debugging example, and candidate questions. |

Score each question from 0 to 3 using the rubric in [common.md](common.md). Record evidence and hints given; do not use one total-score threshold for every level. Use the same core questions and support policy for candidates applying to the same role.

Some exercise READMEs are still scaffold templates. Before assigning an exercise, document the observable behavior, required fix, setup, and acceptance criteria. Do not grade unstated requirements. Provide only the selected candidate exercise; keep interviewer notes and reference solutions private.

### Runnable Practical Exercises

These three new exercises use plain HTML/CSS/JavaScript and deterministic local
data. Open the HTML directly in a browser; no server or installation is required.

| Exercise | Candidate page | Private reference | Time |
| --- | --- | --- | --- |
| Dynamic task list / event delegation | [Open](vanilla-js/test-script-event-delegation/index.html) | [Open fixed](vanilla-js/test-script-event-delegation-fixed/index.html) | 20 minutes |
| Independent search / debounce / request race | [Open](vanilla-js/test-script-search-race/index.html) | [Open fixed](vanilla-js/test-script-search-race-fixed/index.html) | 30 minutes |
| Responsive agenda / keyboard controls | [Open](css/test-css-responsive-agenda/index.html) | [Open fixed](css/test-css-responsive-agenda-fixed/index.html) | 20 minutes |

Each candidate folder has its own brief and acceptance criteria. Each reference
folder has a solution explanation and rubric. Preserve the intentionally broken
candidate variants; do not replace them with reference solutions.

Browser verification is isolated in [tests/practical-exercises](tests/practical-exercises/README.md):

```powershell
npm --prefix tests/practical-exercises install
npm --prefix tests/practical-exercises run install-browser
npm --prefix tests/practical-exercises test
```

The default suite tests fixed variants. Broken variants must fail the corresponding
behavior checks; see the test README for variant and installed-browser options.

### Adding New Questions

1. Choose the appropriate category folder
2. Create a new markdown file with descriptive name
3. Include: question, difficulty level, expected answer, and evaluation points
4. Update the folder's index if applicable

## Guidelines

- Keep questions relevant to actual job requirements
- Include both theoretical and practical exercises
- Provide clear evaluation criteria
- Update materials regularly based on feedback

## Contributing

When adding new interview materials:
- Ensure questions are unbiased and inclusive
- Test questions with team members first
- Document any required setup or prerequisites
- Include Vietnamese translations where helpful

## Confidentiality

**Important:** This repository contains proprietary interview materials. Do not share externally or with candidates.
