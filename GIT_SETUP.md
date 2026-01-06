# Git Configuration Setup

## Important: Use Your Personal Email

Since you'll be creating the GitHub repository manually with your personal account, make sure to configure Git with your personal email (not your office email).

## Configure Git (Run these commands)

Replace with your personal GitHub email and name:

```bash
git config user.name "Your Name"
git config user.email "your.personal.email@example.com"
```

Or set globally for all repositories:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.personal.email@example.com"
```

## Verify Configuration

Check your current Git config:

```bash
git config user.name
git config user.email
```

## Update Previous Commit (Optional)

If you want to update the author of the initial commit:

```bash
git commit --amend --reset-author
```

## Next Steps

1. Configure Git with your personal email (commands above)
2. Create GitHub repository manually with your personal account
3. Push the code to GitHub
4. Deploy to Vercel

See `QUICK_START.md` for deployment steps after GitHub setup.

