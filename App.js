import React, { Component } from 'react';

const products = { 'Apple': {name: 'Apple', price: 10, stock: 12},
                   'Melon': {name: 'Melon', price: 20, stock:  5},
                  'Orange': {name:'Orange', price:  8, stock: 20} }



class Cart extends Component {
  constructor(props) {
    super(props);
    this.onIncrease = this.onIncrease.bind(this);
    this.onDecrease = this.onDecrease.bind(this);
    this.firstRun = true;
 }

  onIncrease() {
    this.props.onProductBuy(this.props.name, this.props.price, this.props.bought+1, this.props.stock)
  }

   onDecrease() {
    this.props.onProductBuy(this.props.name, this.props.price, this.props.bought-1, this.props.stock)
  }

  render() {

    if (this.props.bought>0) {
      this.firstRun = false;
    }

    if (this.props.bought === 0 && this.firstRun === true) {
      return null;
    }

    return (
      <div key={this.props.name.toString()}>
        <span style={(this.props.bought === 0) ? {textDecoration:"line-through"}:{textDecoration:"none"}}>{this.props.name} – ${this.props.price} × {this.props.bought}</span>
        {(this.props.bought === this.props.stock) ?  <button disabled>+1</button> : <button onClick={this.onIncrease}>+1</button>}
        {(this.props.bought === 0) ?  <button disabled>-1</button> : <button onClick={this.onDecrease}>-1</button>}
        ({this.props.stock-this.props.bought} in stock)
      </div>
    )
  }
}

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.onBuy = this.onBuy.bind(this);
  }

  onBuy(e) {
    if (this.props.bought !== this.props.stock) {
      this.props.onProductBuy(this.props.name, this.props.price, this.props.bought+1, this.props.stock)
    }
  }

  render() {
    let button = (this.props.bought === this.props.stock) ? <button disabled>Buy</button> : <button onClick={this.onBuy}>Buy</button>

    return (
      <div key={this.props.name.toString()}>
        {this.props.name} – ${this.props.price}
        {button}
        ({this.props.bought} selected, {this.props.stock - this.props.bought} in stock)
      </div>
    )
  }
}


class Final extends Component {
  constructor(props) {
    super(props);
    this.stockChange = this.stockChange.bind(this);
    this.onCheckout = this.onCheckout.bind(this);
    this.firstRun = true;
    this.state = products;
  }

  stockChange(name, price, bought, stock) {
    this.setState(prevState => ({
      ...prevState, [name]:{name: name, price: price, stock:stock, bought: bought}}
    ))
  }

  onCheckout() {
    this.setState(prevState => ({
      ...prevState, ...products}
    ))
    this.firstRun = true;
  }

  render() {
    let cart=[];
    let total = 0;
    let inventory=[];

    for (var key in this.state) {
      let obj = this.state[key];
      inventory.push (<Inventory name={obj.name} price={obj.price} stock={obj.stock} bought={obj.bought||0} onProductBuy={this.stockChange} />)
      cart.push (<Cart name={obj.name} price={obj.price} stock={obj.stock} bought={obj.bought||0} onProductBuy={this.stockChange}/>)
      total += (obj.bought||0)*obj.price;
    }

    let cartRend = (this.firstRun === true) ? <div><i>Your cart is empty</i></div> : <div>{cart}</div>;
    this.firstRun = false;

    return(
      <div>
        <h3>Cart</h3>
          {cartRend}
        <div>
          Total: ${total}
          <button onClick = {this.onCheckout}>checkout</button>
        </div>
        <hr></hr>
        <h3>Inventory</h3>
        <div>
          {inventory}
        </div>
      </div>
    )
  }
}

export default Final;
