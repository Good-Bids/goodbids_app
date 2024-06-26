# Good Bids Front-end application

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

We're using the following under the hood:
- [Next.js](https://nextjs.org)
- [supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](radix-ui.com)

## Deploying

Our app auto-deploys on pushes to main. To see the latest version, go to 
[goodbids-app.vercel.app](goodbids-app.vercel.app).


### Manual Deploys

To deploy to vercel, there's a couple of steps:
```zsh
$ npm install -g vercel
```

...you'll need to log in the first time.
```zsh
$ vercel login
```

To deploy to vercel & update the repo in one fell swoop:
```zsh
$ npm run deploy
```


## Updating types locally
[from the supabaase docs](https://supabase.com/docs/guides/database/api/generating-types)

to update db types locally, first you need to install the supabase cli
```zsh
npx install supabase
```

next, log in. this may require generating a personal secret key on the supabase site
```zsh
npx supabase login
```

after this, run the command below.
```zsh
npm run update-types
```

at the end of this, you should see updates to the file `src/utils/types/supabase.ts`


## ---- original text from the starter repo ----
### What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.


### Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

### How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
