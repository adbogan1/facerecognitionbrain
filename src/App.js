import './App.css';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import ParticlesBg from 'particles-bg'
import React from 'react';
import Clarifai from 'clarifai';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const initialState = {
  input: '',
  imageURL: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
    
  }
}
class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
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
      fetch('https://facerecognitionbrain-api-rk5b.onrender.com/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              input: this.state.input
            })
          })
        .then(response => response.json())
        .then(response => {
          if (response) {
            fetch('https://facerecognitionbrain-api-rk5b.onrender.com/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
              .then(response => response.json())
              .then(count => {
                this.setState(Object.assign(this.state.user, { entries: count }))
              })
              .catch(console.log)
          }
          this.displayFaceBox(this.calculateFaceLocation(response)
          )})
        .catch(err => console.log(err));

  }

  onRouteChange = (route) => {
    if (route == 'home') {
      this.setState({isSignedIn: true})
    } else {
      this.setState(initialState)
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
        <Rank name={this.state.user.name} entries={this.state.user.entries}/>
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={box} imageURL={imageURL} /> 
        </div>
        : (
            route == 'signin' 
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          ) 
        }
        
      </div>
    );
  }
}

export default App;
