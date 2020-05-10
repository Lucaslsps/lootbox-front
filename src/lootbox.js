import React, { Component } from 'react';
import axios from 'axios';
import './css/style.css';
import './css/monojsilag.css';
import { GoogleLogin } from 'react-google-login';

// Links API
const servidor_draw = process.env.REACT_APP_SERVIDOR_DRAW;
const servidor_auth = process.env.REACT_APP_SERVIDOR_AUTH
const servidor_addCard = process.env.REACT_APP_SERVIDOR_ADD_CARD

const btn_timer = 10000;

class Lootbox extends Component{
  //
  // Construtor com os props da classe
  //
  constructor(props){
    super(props);

    this.state={
      time: btn_timer,
      start: 0,
      cardList:[],
      userCardList:[],
      logged_in: false,
      email: "",
      name:"", 
      token:"",
      disableCard:false
    }

    this.draw = this.draw.bind(this);
    this.addToUser = this.addToUser.bind(this);
  }

  //
  // Google login
  //
  logout = () => {
    this.setState({logged_in: false, token: '', user:    null})
  };
  
  onFailure = (error) => {
    console.log(error);
  };

  googleResponse = (response) => {
    const tokenBlob = new Blob([JSON.stringify({
      access_token: response.accessToken,
      profile_object: response.profileObj
    
    }, null, 2)], {type : 'application/json'});
    
    const options = {
        method: 'POST',
        body: tokenBlob,
        cache: 'default'
    };

    fetch(servidor_auth, options)
    .then(response => response.json())
    .then(res => {
      this.setState({
        logged_in:true, 
        userCardList:res['cardList'],
        email:res['email'],
        name:res['name']
      })
    })
  };

  //
  // Função para chamar com os cards
  //
  draw(){
    // O botão só funciona caso tenha passado 5 segundos
    if(this.state.time >= btn_timer){
      // Busca as informações na api
      fetch(servidor_draw)
      .then(response => response.json())
      .then(data => {
        this.setState({cardList:data, disableCard:false})
      })
      .then(()=> {
        // Reseta o timer
        clearInterval(this.timer);
        this.setState({
          time: 0
        })      

        // Inicia o timer
        this.setState({
          possibleDraw: false,
          time: this.state.time,
          start: Date.now() - this.state.time
        })
        this.timer = setInterval(() => this.setState({
          time: Date.now() - this.state.start
        }), 1);
        
      });                    
    }
  }
  
  //
  // Função para logar usuário sem google (em desenvolvimento)
  //
  login = event =>{
    event.preventDefault();
    /*
    axios.post(servidor_auth,{
        user:{
          username: "this.state.username", 
          password: "tetete"
      }
    })
    .then( res => {
      console.log(res)
    })*/
  }

  handleUsernameChange = event =>{
    this.setState({username:event.target.value})
  }

  //
  // Função para adicionar card ao usuario
  //
  addToUser(card){
    if(this.state.logged_in){
      
      axios.post(servidor_addCard,{
        card: card,
        email: this.state.email
      })
      .then( res => {
        this.setState({disableCard:true})
        alert("Personagem adicionado a seu inventário")
      })

    }else{
      alert("Faça login para adicionar o card a sua conta")
    }
    
  }

  //
  // Renderização do site
  //

  render(){

    // Div principal, com os cards
    let cards = 
      <div className="Lootbox">
        <div className="card-wrapper">
          <div className="box">
              {this.state.cardList.map(item =>{
                return(
                  <div className= {"card sel " + item.cardRarity}>
                    <div className="imgBx" onClick={this.state.disableCard ? () => console.log("bla"): () => this.addToUser(item)}>
                      <img id="img" src={item.cardPath} alt="images"></img>
                    </div>
                    
                    <div className="details">
                        <h2 id="nome">{item.cardName}</h2>
                    </div>
                  </div>
                );
              })
              }
          </div>
        </div>
      </div>

    // Div com o botão
    let button = (this.state.time >= 5000) ?
      <button onClick={()=> this.draw()}>Lootbox-e! </button> :
      <button onClick={()=> this.draw()}>Em cooldown! {((5000 - (this.state.time))/1000).toFixed(0)}seg</button>
    
    // Div com o timer
    let timer = 
      <div>timer: {this.state.time}</div>


    // Título
    let title =
       <div className ="title">
         <h1 className ="title">Lootbox Generator</h1>
       </div>

    // Login
    let login =
    <div className="login">
      <form onSubmit={this.login}>
        <input className="form-control" placeholder="nickname" onChange={this.handleUsernameChange}></input>
        <input type="submit" value="Enviar"></input>
      </form>
    </div>

    // Google Login
    let google_login = !!this.state.logged_in ?
            (
                <div className="login">
                    <p>Logged in</p>
                    <div>
                        {this.state.email}
                    </div>
                    <div>
                        <button onClick={this.logout} className="button">
                            Log out
                        </button>
                    </div>
                </div>
            ) :
            (
                <div className="login">
                    <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_ID}
                        buttonText="Login"
                        onSuccess={this.googleResponse}
                        onFailure={this.onFailure}
                    />
                </div>
            );

    // Retorna todas as divs juntas
    return(
      <div>
        <div className="top-screen">
          {title}
          {login}
          
        </div>
        <hr className="divisor"></hr>
        <div className="bottom-screen">
          {cards}
          {button}
          {google_login}
        </div>
      </div>
    );
  }
}

export default Lootbox;