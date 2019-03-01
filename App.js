import React, { Component } from 'react';
import PropTypes from 'prop-types';

const products = { 1: {name: 'Apple', price: 10, stock: 12},
                   2: {name: 'Melon', price: 20, stock:  5},
                   3: {name:'Orange', price:  8, stock: 20} }

class Cart extends Component {
  render() {
    return (
      <div>
        <span style={(this.props.bought === 0) ? {textDecoration:"line-through"}:{textDecoration:"none"}}>{this.props.name} – ${this.props.price} × {this.props.bought}</span>
        {<button onClick={() => {this.props.onBuy(this.props.id, +1)}} disabled = {(this.props.bought === this.props.stock)}>+1</button>}
        {<button onClick={() => {this.props.onBuy(this.props.id, -1)}} disabled = {(this.props.bought === 0)}>-1</button>}
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
  render() {
    let button = <button onClick={() => { if (this.props.bought !== this.props.stock) {this.props.onBuy(this.props.id, +1)}}} disabled = {(this.props.bought === this.props.stock)}>Buy</button>

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
    this.state = products;
  }

  stockChange = (id, bought) => {
    this.setState(prevState => ( {[id]:{...prevState[id], bought: (prevState[id].hasOwnProperty('bought')) ? prevState[id].bought + bought : bought}}))
  }

  onCheckout = () => {
    this.setState(prevState => ({
      ...prevState, ...products}
    ))
  }

  render() {
    let cart=[];
    let inventory=[];
    let total = 0;

    for (var key in this.state) {
      let obj = this.state[key];
      inventory.push (<Inventory key={key} id = {key} name={obj.name} price={obj.price} stock={obj.stock} bought={obj.bought||0} onBuy={this.stockChange} />)
      if (obj.hasOwnProperty('bought')) cart.push (<Cart key={key} id = {key} name={obj.name} price={obj.price} stock={obj.stock} bought={obj.bought||0} onBuy={this.stockChange}/>)
      total += (obj.bought||0)*obj.price;
    }

    return(
      <div>
        <h3>Cart</h3>
          {(cart.length === 0) ? <div><i>Your cart is empty</i></div> : <div>{cart}</div>}
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
