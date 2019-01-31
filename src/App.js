import React, { Component } from 'react'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Register from './components/Register/Register'
import SignIn from './components/SignIn/SignIn'
import Particles from 'react-particles-js'
import Clarifai from 'clarifai'
import './App.css'

const app = new Clarifai.App({
  apiKey: '2614490b8ab04731bac009efda29ccd2'
})

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 300
      }
    }
  }
}

class App extends Component {
  // box will have top, left, bottom, right prop therefore object needed
  state = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false
  }

  // calculate location of face on img
  calculateFaceLocation = data => {
    const clarifaiFace =
      // grab face location points from Clarifai
      data.outputs[0].data.regions[0].region_info.bounding_box
    // grab the image from FaceRecognition.js (img src is from "imageUrl" state)
    const image = document.getElementById('imageInput')
    // get width and height of image
    const width = Number(image.width)
    const height = Number(image.height)
    // take %-values from Clarifai and save them as keys in object
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    }
  }

  displayFaceBox = box => {
    this.setState({ box: box })
  }

  onInputChange = event => {
    // change empty input to user URL
    this.setState({ input: event.target.value })
  }

  onButtonSubmit = () => {
    // take updated input state and save as imageUrl
    this.setState({ imageUrl: this.state.input })
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      // take complete Clarifai response and calc face locations
      .then(response =>
        this.displayFaceBox(this.calculateFaceLocation(response))
      )
      .catch(err => console.log(err))
  }

  onRouteChange = route => {
    // change route according to parameters (run func in components)
    this.setState({ route: route })

    if (route === 'signout') {
      this.setState({ isSignedIn: false })
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state
    const { onRouteChange, onInputChange, onButtonSubmit } = this
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              // pass event.target.value as props so it listens for input change
              onInputChange={onInputChange}
              // pass predict function as props so it listens for button click
              onButtonSubmit={onButtonSubmit}
            />
            <FaceRecognition
              // pass imageUrl src as props to component that displays img
              imageUrl={imageUrl}
              box={box}
            />
          </div>
        ) : route === 'signin' ? (
          // if signin is true in state then show <Signin> component. Otherwise show homepage
          <SignIn onRouteChange={onRouteChange} />
        ) : (
          <Register onRouteChange={onRouteChange} />
        )}
      </div>
    )
  }
}

export default App
