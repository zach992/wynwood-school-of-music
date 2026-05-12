# Branching & Deploy Discipline

`main` is the live site (wynwoodschoolofmusic.com). Every push to `main` rebuilds production. So:

> **Never commit directly to `main`. Every change goes through a branch → PR → merge.**

Branch protection is enabled on GitHub — direct pushes to `main` will be refused.

## The everyday workflow

```bash
# 1. Start from a clean main
git checkout main
git pull

# 2. Make a branch named for what you're doing
git checkout -b fix-pricing-typo

# 3. Edit, commit as you go
git add <files>
git commit -m "Fix typo in piano lesson pricing"

# 4. Push the branch
git push -u origin fix-pricing-typo

# 5. Open a PR
gh pr create

# 6. Review the diff on GitHub, then merge
gh pr merge --squash --delete-branch
```

Step 6 is what triggers the Railway production rebuild (~2 min).

## Branch naming

| Prefix   | Use for                  | Example                          |
| -------- | ------------------------ | -------------------------------- |
| `fix-`   | bug fixes                | `fix-contact-form-validation`    |
| `feat-`  | new pages / features     | `feat-recital-signup-page`       |
| `copy-`  | text / content edits     | `copy-update-team-bios`          |
| `chore-` | deps, config, cleanup    | `chore-bump-next-version`        |

Kebab-case, short, descriptive.

## Rules of thumb

1. **One branch = one concern.** Don't mix a copy fix and a new feature on one branch — you want to be able to revert just the broken thing.
2. **Commit often, push often.** Small commits with clear messages > one giant "updated stuff" commit.
3. **Look at the PR diff in GitHub before merging.** 30 seconds of "does this look right?" catches a lot.

## When prod breaks

The whole reason for this workflow — you can roll back without panic:

```bash
git checkout main
git pull
git revert HEAD          # new commit that undoes the last one
git push                 # admin override; allowed on this repo
```

Railway redeploys the reverted state. Then fix forward on a branch.

If the broken merge wasn't the last one, find the commit hash with `git log` and run `git revert <hash>`.

## Emergency push (rare)

Admins (you) can still push directly to `main` if you absolutely must. It should feel uncomfortable, not routine. The point of the workflow is that normal-mode-Zach has guardrails and emergency-mode-Zach can break them when it actually matters.
