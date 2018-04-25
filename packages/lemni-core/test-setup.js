const enzyme = require('enzyme')
// FIX ME: remove when official fix is published
// https://github.com/airbnb/enzyme/pull/1513
// const Adapter = require('enzyme-adapter-react-16')
const Adapter = require('./ReactSixteenAdapter')

enzyme.configure({ adapter: new Adapter() })