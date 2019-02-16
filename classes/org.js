var rp = require('request-promise-native')

require('dotenv').load()
console.log(process.env.token)

class Org {
  constructor (orgName) {
    this._orgName = orgName
    this._numberRepos = this.getNumberRepos()
  }
  get orgName () {
    return this._orgName
  }
  set orgName (orgName) {
    this._orgName = orgName
  }

  get numberRepos () {
    return this._numberRepos
  }
  set numberRepos (numberRepo) {
    this._numberRepos = numberRepo
  }

  getNumberRepos () {
    console.log(this.orgName)
    var options = {
      uri: `https://api.github.com/orgs/${this.orgName}`,
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
    }
    rp(options)
      .then(function (repos) {
        console.log(repos.public_repos)
        this.numberRepo = repos.public_repos
      })
      .catch(function (err) {
        console.error(err)
      })
  }
}

const org = new Org('algolia')
// org.getRepos()
// console.log(square.area) // 100
