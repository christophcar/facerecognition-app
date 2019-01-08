import React, { Component } from 'react'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
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
  state = {
    input: '',
    imageUrl: '',
    box: {}
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
    console.log(box)
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

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          // pass event.target.value as props so it listens for input change
          onInputChange={this.onInputChange}
          // pass predict function as props so it listens for button click
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition
          // pass imageUrl src as props to component that displays img
          imageUrl={this.state.imageUrl}
          box={this.state.box}
        />
      </div>
    )
  }
}

export default App
