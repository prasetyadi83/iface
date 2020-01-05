import React, { Component } from "react";
import Navigation from "./components/navigation/Navigation";
import SignIn from "./components/signin/SignIn";
import Register from "./components/register/Register";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/imagelinkform/ImageLinkForm";
import FaceRecognition from "./components/facerecognition/FaceRecognition";
import Rank from "./components/rank/rank";
import Particles from "react-particles-js";
import "./App.css";

const particleOpt = {
  particles: {
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }
  }
};

const initialState = {
  input: "",
  imageUrl: "",
  faceBox: {},
  route: "signin",
  isSignedIn: false,
  ourUsers: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = dataMasuk => {
    this.setState({
      ourUsers: {
        id: dataMasuk.id,
        name: dataMasuk.name,
        email: dataMasuk.email,
        entries: dataMasuk.entries,
        joined: dataMasuk.joined
      }
    });
  };

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  faceLocation = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const clarifaiImage = document.getElementById("inputimage");
    const width = Number(clarifaiImage.width);
    const height = Number(clarifaiImage.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  };

  displayFaceBox = box => {
    console.log(box);
    this.setState({ faceBox: box });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch("https://floating-sierra-27169.herokuapp.com/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch("https://floating-sierra-27169.herokuapp.com/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.ourUsers.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(
                Object.assign(this.state.ourUsers, { entries: count })
              );
            });
        }
        this.displayFaceBox(this.faceLocation(response));
      })
      .catch(err => console.log(err));
  };

  onRouteChange = route => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    return (
      <div className="App">
        <Particles className="partikel" params={particleOpt} />
        <Navigation
          isSignedIn={this.state.isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {this.state.route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.ourUsers.name}
              entries={this.state.ourUsers.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              box={this.state.faceBox}
              imageUrl={this.state.imageUrl}
            />
          </div>
        ) : this.state.route === "signin" ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
