Create a PR for the current branch.

## Steps

1. Run `git log --oneline main..HEAD` to understand all commits on this branch.
2. Run `git diff main` to see the full diff.
3. Verify the branch has been pushed to remote (`git branch -vv`). If not, stop and ask Victor to push first.
4. Determine which issue(s) this branch closes from the commit history and branch name.
5. Create the PR using `gh pr create` with:
   - Title in conventional commits format: `type: description (#issue)`
   - Body with: Summary (1-3 bullets), Changes, How to test (if applicable)
   - Use `Closes #XX` in the body for each issue
6. Return the PR URL.

## Rules

- Do NOT push the branch — if it's not pushed, stop and ask Victor to push first
- Prerequisite: `/review` should have passed. If unsure, ask Victor before proceeding.
