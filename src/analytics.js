const ghAPI = require('./github')
const fs = require('fs')
const _ = require('lodash')

var sqlite3 = require('sqlite3')
var db = new sqlite3.Database('algolia.db')

var exports = (module.exports = {})

exports.getAllRepos = async function (orgName, small) {
  let nbRepos = await ghAPI.getNumberRepos(orgName)
  if (small) {
    var nbRepoCall = 2
  } else {
    var nbRepoCall = Math.round(nbRepos / 30) + 1
  }
  let repoNames = []
  for (let i = 1; i < nbRepoCall + 1; i++) {
    let temp = await ghAPI.getNamesRepos(orgName, i)
    repoNames.push(temp)
  }
  repoNames = _.flattenDeep(repoNames)
  return repoNames
}

exports.getContribs = async function (orgName, repoNames) {
  let contribs = []
  for (let i = 0; i < repoNames.length; i++) {
    let temp2 = await ghAPI.getMonthlyNewContrib(orgName, repoNames[i], 0)
    contribs.push(temp2)
  }
  return contribs
}

exports.generateDataSet = async function (orgName, small) {
  let repoNames = await exports.getAllRepos(orgName, small)
  console.log(repoNames.length)
  let contribs = await exports.getContribs(orgName, repoNames)
  let result = {}

  repoNames.forEach(async (element, index) => {
    for (const key in contribs[index]) {
      db.serialize(function () {
        db.run(
          `insert into data (repository,date,number_of_new_contributor) values ('${element}','${key}',${
            contribs[index][key]
          })`
        )
      })
    }
    result[element] = contribs[index]
  })
  db.close()
}

// to generate the small dataset, otherwise set to false but it will take a long time
// due to all the 202 code of the api
exports.generateDataSet('algolia', true)
