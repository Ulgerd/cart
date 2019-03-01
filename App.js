import React, { Component } from 'react';
import PropTypes from 'prop-types';

const products = { 1: {name: 'Apple', price: 10, stock: 12},
                   2: {name: 'Melon', price: 20, stock:  5},
                   3: {name:'Orange', price:  8, stock: 20} }

class Cart extends Component {
  render() {
    let prod = this.props
    return (
      <div>
        <span style={(prod.bought === 0) ? {textDecoration:"line-through"}:{textDecoration:"none"}}>{prod.name} – ${prod.price} × {prod.bought}</span>
        {<button onClick={() => {prod.onBuy(prod.id, +1)}} disabled = {(prod.bought === prod.stock)}>+1</button>}
        {<button onClick={() => {prod.onBuy(prod.id, -1)}} disabled = {(prod.bought === 0)}>-1</button>}
        ({prod.stock-prod.bought} in stock)
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
    let prod = this.props
    return (
      <div>
        {prod.name} – ${prod.price}
        {<button onClick={() => { if (prod.bought !== prod.stock) {prod.onBuy(prod.id, +1)}}} disabled = {(prod.bought === prod.stock)}>Buy</button>}
        ({prod.bought} selected, {prod.stock - prod.bought} in stock)
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
