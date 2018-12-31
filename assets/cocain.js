/* eslint-env browser */
/* global prettyPrintJson */

let progress
let result
let src
let csv

function calculate () {
  progress.style.display = ''
  document.getElementById('progress').scrollIntoView()

  fetch('/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ src: src.value })
  })
    .then(async response => {
      let json = await response.json()
      if (response.status === 200) return json
      throw Error(`/api returned ${response.status}: ${response.statusText}\n\n${json.error}`)
    })
    .then(data => {
      result.innerHTML = prettyPrintJson.toHtml(data)
    })
    .catch(error => alert(error.message))
    .then(() => {
      progress.style.display = 'none'
    })
}

function loadJSON (url) { // eslint-disable-line no-unused-vars
  fetch(url, { method: 'GET' })
    .then(async response => {
      let text = await response.text()
      if (response.status === 200) return text
      throw Error(`${url} returned ${response.status}: ${response.statusText}\n\n${text}`)
    })
    .then(data => {
      src.value = data
      calculate()
    })
    .catch(error => alert(error.message))
}

function convertCsv () { // eslint-disable-line no-unused-vars
  let formData = new FormData()
  for (let file of csv.files) {
    formData.append('csv', file)
  }

  fetch('/convertCsv', {
    method: 'POST',
    body: formData
  })
    .then(async response => {
      let json = await response.json()
      if (response.status === 200) return JSON.stringify(json, null, 2)
      throw Error(`/convertCsv returned ${response.status}: ${response.statusText}\n\n${json.error}`)
    })
    .then(data => {
      src.value = data
      calculate()
    })
    .catch(error => alert(error.message))
}

Storage.prototype.setObj = function (key, obj) {
  return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function (key) {
  return JSON.parse(this.getItem(key))
}

/* initialize the sessionStorage */
if (sessionStorage.data === undefined) {
  sessionStorage.setObj('data', {
    resources: [],
    products: []
  })
}
