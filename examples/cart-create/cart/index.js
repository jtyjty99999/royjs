import React from 'react';
import { connect } from '../../../src';
import CartList from './cart-list';
import './store';

@connect(state => state.cart)
export default class Cart extends React.Component {
    state = {
        isEdit: false
    };

    edit = () => {
        this.setState({
            isEdit: true
        });
    };

    complete = () => {
        this.setState({
            isEdit: false
        });
    };

    selectAll(e) {
        this.props.dispatch('cart.selectAll', {
            checked: e.target.checked
        });
    }

    onRemove = () => {
        this.props.dispatch('cart.onRemove');
    };
    renderCart() {
        const { list } = this.props;
        if (list.length) {
            return <ul className="goods-list cart-list">{this.renderList(list)}</ul>;
        }
        return (
            <div className="empty-states">
                <span>这里是空的，快去逛逛吧</span>
            </div>
        );
    }
    render() {
        console.log('cart, render');
        const selectedItems = this.props.list.filter(item => item.selected);
        const selectedNum = selectedItems.length;
        const totalPrice = selectedItems.reduce((total, item) => {
            total += item.quantity * item.price;
            return total;
        }, 0);
        const checked = selectedItems.length === this.props.list.length && selectedItems.length > 0;
        const { isEdit } = this.state;
        return (
            <div className="device" id="page-cart">
                <header>
                    <span className="header-title">购物清单</span>
                    <span className="header-edit">
                        {!isEdit ? <span onClick={this.edit}>编辑</span> : <span onClick={this.complete}>完成</span>}
                    </span>
                </header>
                <div className="page"><CartList /></div>
                <div className="action-bar">
                    <div className="g-selector">
                        <div className="item-selector">
                            <div className="icon-selector">
                                <input type="checkbox" onChange={this.selectAll.bind(this)} checked={checked} />
                            </div>
                        </div>
                        <span>全选</span>
                    </div>
                    {!isEdit ? (
                        <div className="action-btn buy-btn">去结算({selectedNum})</div>
                    ) : (
                        <div className="action-btn del-btn" onClick={this.onRemove}>
                            删除({selectedNum})
                        </div>
                    )}
                    <div className="total">
                        合计：
                        <span>
                            ¥<b>{totalPrice}</b>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}
