import React, { Component } from 'react';
import './css/style.css';
import './css/monojsilag.css';

const servidor_draw = "http://localhost:3000/draw";
//const servidor_draw = "https://lootbox-pxt.herokuapp.com/draw";

const servidor_users = "http://localhost:3000/users";
//const servidor_users = "https://lootbox-pxt.herokuapp.com/users";

const btn_timer = 5000;

class Lootbox extends Component{
  // Construtor com os atributos da classe
  constructor(props){
    super(props);

    this.state={
      time: btn_timer,
      start: 0,
      cardList:[],
      username: "",
      password: "",
      logged_in: false
    }

    this.draw = this.draw.bind(this);
  }
  
  // Função para chamar a api
  draw(){
    // O botão só funciona caso tenha passado 5 segundos
    if(this.state.time >= btn_timer){
      // Busca as informações na api
      fetch(servidor_draw)
      .then(response => response.json())
      .then(data => {
        this.setState({cardList:data})
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

  //Função para logar usuário
  login = event =>{
    event.preventDefault();
    
    fetch(servidor_users, {
      method:"POST",
      headers: {'Content-Type': 'applications/json'},
      body: JSON.stringify({
        user:{
          username: "this.state.username", 
          password: "tetete"
        }
      })
    })
    .then( res => res.json())
    .then(data =>{
      console.log(data)
    })
  }

  handleUsernameChange = event =>{
    this.setState({username:event.target.value})
  }

  componentDidMount(){

  }
  

  render(){

    // Div principal, com os cards
    let cards = 
      <div className="Lootbox">
        <div className="card-wrapper">
          <div className="box">
              {this.state.cardList.map(item =>{
                return(
                  <div className= {"card sel " +item.cardRarity}>
                    <div className="imgBx">
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
        </div>
      </div>
    );
  }
}

export default Lootbox;