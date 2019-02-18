const fetch = require('node-fetch')
const _ = require('lodash')
const moment = require('moment')

var exports = (module.exports = {})

require('dotenv').load()

exports.sleep = function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

let makeGetApiCall = async function (url) {
  return new Promise(async (resolve, reject) => {
    fetch(url, {
      method: 'get',
      headers: { Authorization: `Bearer ${process.env.token}` }
    })
      .then(async res => {
        if (res.status === 202) {
          await exports.sleep(46000)
          let json = await makeGetApiCall(url)
          resolve(json)
        }
        if (res.status === 200) {
          let json = await res.json()
          resolve(json)
        }
        if (res.status === 404) {
          console.log(res)
        } else {
          // console.log(res.status)

          reject(Error('failed'))
        }
      })
      .catch(e => reject(e))
  })
}

exports.getNumberRepos = function (orgName) {
  return new Promise((resolve, reject) => {
    let url = `https://api.github.com/orgs/${orgName}`
    makeGetApiCall(url)
      .then(res => {
        resolve(res.public_repos)
      })
      .catch(err => reject(err))
  })
}

exports.getNamesRepos = function (orgName, page) {
  return new Promise((resolve, reject) => {
    let names = []
    let url = `https://api.github.com/orgs/${orgName}/repos?per_page=30&page=${page}`
    makeGetApiCall(url)
      .then(res => {
        res.forEach(element => {
          names.push(element.name)
        })
        resolve(names)
      })
      .catch(err => reject(err))
  })
}

let getWeeklyNewContrib = function (orgName, repo, page) {
  return new Promise((resolve, reject) => {
    let url = `https://api.github.com/repos/${orgName}/${repo}/stats/contributors?per_page=100&page=${page}`
    makeGetApiCall(url)
      .then(res => {
        resolve(res)
      })
      .catch(err => reject(err))
  })
}

let generateWeeklyActivity = function (weeks) {
  return new Promise((resolve, reject) => {
    let contribs = {}
    if (weeks[0]) {
      let lenght = weeks[0].length
      for (let i = 0; i < lenght; i++) {
        // check if weeks is not empty
        if (weeks[0]) {
          let numberOfWeek = weeks[0][i]['w']
          contribs[numberOfWeek.toString()] = 0
          let j = 0
          weeks.forEach(element => {
            if (weeks.lenght === 0) {
              resolve(contribs)
            }
            if (element[i]['c'] !== 0) {
              contribs[numberOfWeek.toString()]++
              // delete the contributor, he is not new anymore
              _.pullAt(weeks, [j])
            }
            j++
          })
        } else {
          resolve(contribs)
        }
      }
      resolve(contribs)
    } else {
      resolve(contribs)
    }
  })
}

exports.getMonthlyNewContrib = function (orgName, repo, page) {
  return new Promise((resolve, reject) => {
    getWeeklyNewContrib(orgName, repo, page)
      .then(async res => {
        let weeks = []
        res.forEach(element => {
          weeks.push(element['weeks'])
          // console.log(element['author']['login'])
        })
        let weeklyResult = await generateWeeklyActivity(weeks)
        let monthlyResult = convertWeeksToMonthContribs(weeklyResult)
        resolve(monthlyResult)
      })
      .catch(err => console.error(err))
  })
}

let transforEpoch = function (unixTime) {
  var day = moment.unix(unixTime)
  let dateString = day.year() + '-' + day.month() + '-' + 1
  return dateString
}

let convertWeeksToMonthContribs = function (weeks) {
  let month = {}
  // create entry in the dic to avoid NaN as values
  for (const key in weeks) {
    let monthEntry = transforEpoch(key)
    month[monthEntry] = 0
  }
  // populate the dic
  for (const key in weeks) {
    let monthEntry = transforEpoch(key)
    month[monthEntry] = month[monthEntry] + weeks[key]
  }
  return month
}
