# An onchain game that's easy to play

[WordDuel](https://www.wordduel.xyz/) is a fully onchain game built on Base. This is a P2P, turn-based game based on a popular New York Times game called [Wordle](https://en.wikipedia.org/wiki/Wordle). The difference is that you play a friend and if you win, you'll earn some Base ETH.

## How do you play ?

WordDuel is an onchain, turn-based game meant to be played with two players in real-time. Each player takes a turn guessing the right word. You can learn how to play [here](https://www.nytimes.com/games/wordle/index.html).

Start by signing up with your email and depositing ETH into a wallet that's created on your behalf. To create a game or "duel", you'll declare your opponent's email and the cost for each guess. The only person who can accept the duel is the owner of the email you declared. Let's say you set this guess cost to 0.01 ETH. Each time a player makes a guess they'll have to spend 0.01 ETH. Whoever guesses the right word first, wins all the ETH that has been spent during the duel.

More details coming soon! Follow me on [twitter](https://twitter.com/davidhurley87) or sign up at [WordDuel](https://www.wordduel.xyz/)!

## Who am I?

My name is [David Hurley](https://twitter.com/davidhurley87).

I'm an onchain developer at [Seed Club](https://www.seedclub.xyz/), the lead consumer crypto accelerator. I've also built [Mojo](https://www.mojo.club/) and [LFTG](https://www.lftg.xyz/) in my spare time.

## Install

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Environment Variables

Copy the .env.example file and create your .env.local file.

NEXT_PUBLIC_RPC_URL - I recommend using QuickNode.
NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY - create an account at [Magic](https://magic.link/) and start dedicated wallet project.
RESEND_API_KEY - [Resend](https://resend.com/) for sending transactional emails
SECRET_KEY - create a secret key using this [method](https://chat.openai.com/c/e63fb1d7-4fb1-4b05-8cb8-f830fbd85e3c)
NEXT_PUBLIC_DUELS_CONTRACT_ADDRESS - contract deploy on base. You'll need to be familiar with [Hardhat and Base](https://docs.base.org/guides/deploy-smart-contracts/).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

Mkae sure you add your env variables.

## How You Can Contribute

Here's how you can get involved:

- **Submit a Pull Request:** If you see any potential improvement, go for it. Any contributions are welcome.

- **Sponsor me** I'm looking for at least $2,000 in sponsorship so that I go full-time into building this project.

**Let's have fun onchain!**
