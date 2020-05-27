// href: https://www.w3.org/TR/?tag=css

let lis = document.querySelector('#container').children

let result = []

for (li of lis) {
  result.push({
    name: li.children[1].innerText,
    url: li.children[1].chileren[0].href
  })
}

let json = JSON.stringify(result, null, '  ')
console.log(json)