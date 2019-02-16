var rp = require('request-promise-native')
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')

require('dotenv').load()

let sleep = function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

let makeGetApiCall = async function (url, body) {
  console.log(url)

  return new Promise(async (resolve, reject) => {
    fetch('url', {
      method: 'get',
      headers: { Authorization: `Bearer ${process.env.token}` },
      body: body
    })
      .then(async res => {
        if (res.status === 202) {
          await sleep(36000)
          return makeGetApiCall(url)
        }
        if (res.status === 200) {
          let json = await res.json()
          resolve(json)
        } else {
          reject(Error('failed'))
        }
      })
      .catch(e => reject(e))
  })
}

let getNumberRepos = function (orgName) {
  return new Promise((resolve, reject) => {
    let url = `https://api.github.com/orgs/${orgName}`
    makeGetApiCall(url)
      .then(res => {
        resolve(res.public_repos)
      })
      .catch(err => reject(err))
  })
}

let getNamesRepos = function (orgName, page) {
  return new Promise((resolve, reject) => {
    let names = []
    let url = `https://api.github.com/orgs/${orgName}/repos?per_page=100`
    makeGetApiCall(url, { page: page })
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
    let names = []
    let url = `https://api.github.com/repos/${orgName}/${repo}/stats/contributors?per_page=100?page=${page}`
    makeGetApiCall(url)
      .then(res => {
        // console.log(res)
        resolve(res)
        // res.forEach(element => {
        //   names.push(element.name)
        // })
        // resolve(names)
      })
      .catch(err => reject(err))
  })
}

// getNamesRepos('algolia', 2)
//   .then(res => {
//     console.log(res)
//   })
//   .catch(err => console.error(err))

// getWeeklyNewContrib('algolia', 'intercom', 0).then(res => {
//   console.log(res)
// }).catch(err => console.error(err))

const params = new URLSearchParams()
params.append('page', 1)

fetch('https://api.github.com/orgs/algolia/repos?page=7', {
  method: 'get',
  headers: { Authorization: `Bearer ${process.env.token}` }
})
  .then(res => {
    console.log(res.status)
    return res.json()
  })
  .then(json => console.log(json))
  .catch(e => console.error(e))
