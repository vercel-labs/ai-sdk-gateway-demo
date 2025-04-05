A simple [Next.js](https://nextjs.org) chatbot app to demonstrate the use of the Vercel AI Gateway with the [AI SDK](https://sdk.vercel.ai).

## Getting Started

### One-time setup

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-gateway-demo)

1. Clone this repository with the Deploy button above
1. Install the [Vercel CLI](https://vercel.com/docs/cli) if you don't already have it
1. Clone the repository you created above: `git clone <repo-url>`
1. Link it to a Vercel project under your account: `vc link`
2. Visit the linked Vercel project to enable an authentication token for use with AI Gateway (we're working on automating this):
   1. visit the project settings page (rightmost tab in your project's dashboard)
   2. search for 'OIDC' in settings
   3. toggle the button under "Secure Backend Access with OIDC Federation" to Enabled and click the "Save" button

### Usage
1. Fetch the project's OIDC authentication token locally via `vc env pull`. The token expiry is 12h. You'll need to re-run this command to fetch a new token when it expires (we're working on automating this).
1. Open [http://localhost:3000](http://localhost:3000) with your browser to try the chatbot.

## Authors

This repository is maintained by the [Vercel](https://vercel.com) team and community contributors. 

Contributions are welcome! Feel free to open issues or submit pull requests to enhance functionality or fix bugs.
