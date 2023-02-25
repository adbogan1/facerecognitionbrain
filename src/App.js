import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import ParticlesBg from 'particles-bg'
import React from 'react';
import Clarifai from 'clarifai';

// const app = new Clarifai.App({
//   apiKey: 'f09f9c7b234047cf908aec29aee5e449'
// });

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
    }
  }

  onInputChange = (event) => {
    console.log(event.target.value);
  }

  onButtonSubmit = () => {
    console.log('click');
    // app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
    //   function(response) {

    //   },
    //   function(err) {

    //   }
    // );
  }

  render() {

    return (
      <div className="App">
        <ParticlesBg type="cobweb" color="#ff0000" bg={true} />
        <Navigation />
        <div id='logo'>
          <Logo />
        </div>
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}/>
        {/*<FaceRecognition /> */ }
      </div>
    );
  }
}

export default App;
