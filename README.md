# Data engineer test - algolia

## To run the project

Copy the project on your pc

```
git clone https://github.com/focom/algolia-test.git
cd algolia-test
```

Create a .env file this will contain your Github API token (to have a 5000 rate call on the Github API)

```
echo 'token={your-access-token}' > .env
```

Then install depedencies

```
npm i
```

You can now start the api with

```
npm start
```

Once you have the server running you can test the output of the api with this call

```
curl http://localhost:5000/stat/hn-search
```

It follows this pattern:

```
curl http://localhost:5000/stat/{repo-name}
```

the result will be using json formating, giving the all the stat for this repo

You can generate the dataset with the src/analytics.js file
This is long as I have to wait for Github api to generate the stat for each repo
If i receive a 202 code, i wait 2min and try again

## The dataset

To generate the dataset, here are the steps I made :

- List all the repos of the organisation
- Get the stat of each repo
- Clean the data in the desired format

You can browse the dataset, in algolia.db file. It is a sqliteDB.
It is a subset of all the repo ~ 60 repos.

Use https://sqlitebrowser.org/ to browse the db easily
