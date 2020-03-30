import React, { Component } from 'react';
import './css/style.css';
import './css/monojsilag.css';

const servidor_local = "http://localhost:3000/draw";
const servidor = "https://lootbox-pxt.herokuapp.com/draw";
const btn_timer = 5000;

class Lootbox extends Component{
  // Construtor com os atributos da classe
  constructor(props){
    super(props);

    this.state={
      time: btn_timer,
      start: 0,
      cardList:[]
    }

    this.draw = this.draw.bind(this);
  }
  
  // Função para chamar a api
  draw(){
    // O botão só funciona caso tenha passado 5 segundos
    if(this.state.time >= btn_timer){
      // Busca as informações na api
      fetch(servidor)
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
      <button onClick={()=> this.draw()}>Lootbox-e!</button> :
      <button onClick={()=> this.draw()}>Em cooldown!</button>
    
    // Div com o timer
    let timer = 
      <div>timer: {this.state.time}</div>


    // Título
    let title =
       <div>
         <h1 class ="title">Titulo</h1>
       </div>

    // Retorna todas as divs juntas
    return(
      <div>
        {title}
        {cards}
        {button}
        {timer}
      </div>
    );
  }
}

export default Lootbox;