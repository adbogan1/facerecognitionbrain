import './App.css';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import ParticlesBg from 'particles-bg'
import React from 'react';
import Clarifai from 'clarifai';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const app = new Clarifai.App({
  apiKey: '41fa57bb4c634a15ad2491e03c93872b'
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input})
    app.models.predict({
      id: 'face-detection',
      name: 'face-detection',
      version: '6dc7e46bc9124c5c8824be4822abe105',
      type: 'visual-detector',
      }, this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));

  }

  onRouteChange = (route) => {
    if (route == 'home') {
      this.setState({isSignedIn: true})
    } else {
      this.setState({isSignedIn: false})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, route, box, imageURL } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" color="#ff0000" bg={true} />
        <div className="header">
          <a className="logo"></a>

          { isSignedIn === true
            ? <div className="header-right">
            <a href="#signout" onClick={() => this.onRouteChange('signin')} >Sign Out</a>
            </div>
            : <div className="header-right">
            <a href="#signin" onClick={() => this.onRouteChange('signin')} >Sign In</a>
            <a href="#register" onClick={() => this.onRouteChange('register')} >Register</a>
            </div>
          }

        </div>
        
        { route == 'home' 
        ? <div>
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={box} imageURL={imageURL} /> 
        </div>
        : (
            route == 'signin' 
            ? <Signin onRouteChange={this.onRouteChange} />
            : <Register onRouteChange={this.onRouteChange} />
          ) 
        }
        
      </div>
    );
  }
}

export default App;
