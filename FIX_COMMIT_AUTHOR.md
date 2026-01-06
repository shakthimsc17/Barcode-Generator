## Solution: Update Git Config and Amend Commit

### Step 1: Set Your Personal Email

Run this command (replace with your personal email):

```bash
git config user.email "your.personal.email@example.com"
```

**Example:**
```bash
git config user.email "test.personal@gmail.com"
```

### Step 2: Verify Configuration

Check that it's set correctly:

```bash
git config user.email
git config user.name
```

### Step 3: Amend the Commit to Change Author

This will update the commit with your personal email:

```bash
git commit --amend --reset-author --no-edit
```

The `--reset-author` flag will use your current git config (personal email).
The `--no-edit` flag keeps the same commit message.

### Step 4: Verify the Fix

Check the commit log:

```bash
git log
```

You should now see your personal email instead of the office email.

### Step 5: Force Push (Only if Already Pushed to GitHub)

**⚠️ Only run this if you've already pushed to GitHub:**

```bash
git push --force origin master
```

**If you haven't pushed yet, you're done!** Just push normally when ready.

## Alternative: Set Globally

If you want to set this for all Git repositories on your computer:

```bash
git config --global user.name "test"
git config --global user.email "your.personal.email@example.com"
```

Then amend the commit:
```bash
git commit --amend --reset-author --no-edit
```

## Quick One-Liner (After Setting Email)

After setting your personal email, run:

```bash
git commit --amend --reset-author --no-edit
```

This will update the commit author to use your personal email from git config.

