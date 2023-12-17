# Awsstore-api

This is the backend for Aws.

## Setup

- Clone the repository
- Go into the cloned directory `cd aws-backend`
- Install packages `yarn install`

## Env Variables

Create a `.env` file and copy contents from `.env.local` into it. Ask for the right env variables and replace in your `.env`

## Database - MongoDB

To get mongodb setup locally, please install via brew as it is the easiest way to install on Mac

```sh
 brew tap mongodb/brew
 brew update
 brew install mongodb-community
```

Here is the link to the [Mac OS Docs](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x)
https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/

### Starting and Stopping MongoDB Instance

To start MongoDB instance, run `brew services start mongodb-community`.
To stop MongoDB instance, run `brew services stop mongodb-community`

## Running

Please note, we need to add database users before starting the server. This is a one time action. Please refer to the previous section.

To run locally, run `yarn run dev`

## Testing

To test, run `yarn run test`

## Merging vs Rebasing

We stick to rebasing instead of using merge to have a linear commit history and to avoid the use of unnecesary commits.

## Feature Branches

We create short lived feature branches for all work. After each feature, the branches should be discarded.

## Branch Naming

To be consistent with branch names, all branche names should stick to this convention. `developer initials/ticket number(on product board)/ branch description`. Some examples are `wa/DA-1/create-home-page`, `wa/DA-10/fix-bug-with-form` etc.
