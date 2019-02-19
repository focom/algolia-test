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

The result use the json format. It shows the all the stat for the requested repo

You can generate the dataset with the src/analytics.js file
This is long as I have to wait for Github api to generate the stat for each repo
If I receive a 202 code, I wait ~2min and try again. This part should be handle by a job queu like https://github.com/Automattic/kue

## The dataset

To generate the dataset, here are the steps I made :

- List all the repos of the organisation
- Get the stat of each repo (with this endpoint : https://api.github.com/repos/${orgName}/${repo}/stats/contributors)
- Clean the data in the desired format

You can browse the dataset, in algolia.db file. It is a sqliteDB.
It is a subset of all the repo (~60 repos out of the ~360).

Use https://sqlitebrowser.org/ to browse the db easily
