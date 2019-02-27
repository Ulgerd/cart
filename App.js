import React, { Component } from 'react';
import PropTypes from 'prop-types';

const products = { 'Apple': {name: 'Apple', price: 10, stock: 12},
                   'Melon': {name: 'Melon', price: 20, stock:  5},
                  'Orange': {name:'Orange', price:  8, stock: 20} }


function deepMerge(o1, o2) {
  var o = {};
  for (var i = 0; i < arguments.length; i++) {
    for (var k in arguments[i]) {
      if (typeof arguments[i] !== "undefined") {
        o[k] = (typeof arguments[i][k] == 'object') ?
        deepMerge(o[k], arguments[i][k]) :
        arguments[i][k];
      }
    }
  }
  return o;
}

class Cart extends Component {
  constructor(props) {
    super(props);
    this.onIncrease = this.onIncrease.bind(this);
    this.onDecrease = this.onDecrease.bind(this);
    this.firstRun = true;
 }

  onIncrease() {
    this.props.onProductBuy(this.props.name, this.props.bought+1)
  }

   onDecrease() {
    this.props.onProductBuy(this.props.name, this.props.bought-1)
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
        {<button onClick={this.onIncrease} disabled = {(this.props.bought === this.props.stock)}>+1</button>}
        {<button onClick={this.onDecrease} disabled = {(this.props.bought === 0)}>-1</button>}
        ({this.props.stock-this.props.bought} in stock)
      </div>
    )
  }
}

Cart.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  stock: PropTypes.number.isRequired,
}



class Inventory extends Component {
  constructor(props) {
    super(props);
    this.onBuy = this.onBuy.bind(this);
  }

  onBuy(e) {
    if (this.props.bought !== this.props.stock) {
      this.props.onProductBuy(this.props.name, this.props.bought+1)
    }
  }

  render() {
    let button = <button onClick={this.onBuy} disabled = {(this.props.bought === this.props.stock)}>Buy</button>

    return (
      <div>
        {this.props.name} – ${this.props.price}
        {button}
        ({this.props.bought} selected, {this.props.stock - this.props.bought} in stock)
      </div>
    )
  }
}

Inventory.propTypes = {
   name: PropTypes.string.isRequired,
   price: PropTypes.number.isRequired,
   stock: PropTypes.number.isRequired,
}

Inventory.defaultProps ={
  price: 100,
  stock: 0
}



class Final extends Component {
  constructor(props) {
    super(props);
    this.stockChange = this.stockChange.bind(this);
    this.onCheckout = this.onCheckout.bind(this);
    this.firstRun = true;
    this.state = products;
  }

  stockChange(name, bought) {
    this.setState(prevState => (deepMerge(prevState, {[name]:{bought: bought}})
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
    let inventory=[];
    let total = 0;
    let cartRend;

    console.log(this.state)
    for (var key in this.state) {
      let obj = this.state[key];
      inventory.push (<Inventory key={obj.name.toString()} name={obj.name} price={obj.price} stock={obj.stock} bought={obj.bought||0} onProductBuy={this.stockChange} />)
      cart.push (<Cart key={obj.name.toString()} name={obj.name} price={obj.price} stock={obj.stock} bought={obj.bought||0} onProductBuy={this.stockChange}/>)
      total += (obj.bought||0)*obj.price;
    }

    cartRend = (this.firstRun === true) ? <div><i>Your cart is empty</i></div> : <div>{cart}</div>;
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
