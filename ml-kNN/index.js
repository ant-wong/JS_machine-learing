const KNN = require('ml-knn')
const csv = require('csvtojson')
const prompt = require('prompt')

let knn

const csvFilePath = 'ucal.csv'
const names = ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'type']

let seperationSize

let data = []
    X = []
    y = []

let trainingSetX = []
    trainingSetY = []
    testSetX = []
    testSetY = []

csv({ noheader: true, headers: names })
  .fromFile(csvFilePath)
  .on('json', (jsonObj) => {
    data.push(jsonObj)
  })
  .on('done', (err) => {
    seperationSize = 0.7 * data.length
    data = shuffleArray(data)
    dressData()
  })


const dressData = () => {
  let types = new Set()

  data.forEach((row) => {
    types.add(row.type)
  })

  let typesArray = [...types]

  data.forEach((row) => {
    let rowArr, typeNum
    rowArr = Object.keys(row).map(key => parseFloat(row[key])).slice(0, 4)
    typeNum = typesArray.indexOf(row.type)

    X.push(rowArr)
    y.push(typeNum)
  })

  trainingSetX = X.slice(0, seperationSize)
  trainingSetY = y.slice(0, seperationSize)
  testSetX = X.slice(seperationSize)
  testSetY = y.slice(seperationSize)

  train()
}

const train = () => {
  knn = new KNN(trainingSetX, trainingSetY, { k: 7 })
  test()
}

const test = () => {
  const result = knn.predict(testSetX)
  const testSetLength = testSetX.length
  const predictError = error(result, testSetY)
  console.log(`Test Set Size = ${testSetLength} and the number of Misclassifications = ${predictError}`)
  predict()
}

const error = (predicted, expected) => {
  let misclassifications = 0
  for(let i = 0; i < predicted.length; i++) {
    if(predicted[i] !== expected[i]) {
      misclassifications++
    }
  }
  return misclassifications
}

const predict = () => {
  let temp = []
  prompt.start()

  prompt.get(['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'], (err, result) => {
    if(!err) {
      for(let key in result) {
        temp.push(parseFloat(result[key]))
      }
      console.log(`With ${temp} -- type = ${knn.predict(temp)}`)
    }
  })
}

const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}