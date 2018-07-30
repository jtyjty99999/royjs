import {Store, inject} from '../../src/';
import React from 'react';
import ReactDOM from 'react-dom';

const logger = function (store) {
    store.subscribe(obj => {
        console.log(obj.type, obj.payload, obj.state.toJSON());
    });
};

const devtools = function (store) {
    let tool;
    store.subscribe(obj => {
        if (window.hasOwnProperty('__REDUX_DEVTOOLS_EXTENSION__') && !tool) {
            tool = window.__REDUX_DEVTOOLS_EXTENSION__.connect();
            // tool.subscribe(message => {
            //     if (message.type === 'DISPATCH' && message.state) {
            //         store.set(JSON.parse(message.state));
            //     }
            // });
        }
        tool.send(obj.type, obj.state.toJSON());
    });
};

const store = new Store({
    state: {
        count: 0
    },
    actions: {
        add(state, payload) {
            const {count} = state;
            this.set('count', count + 1);
        },
        reduce(state, payload) {
            const {count} = state;
            this.set('count', count - 1);
        },
        asyncAdd(state, payload) {
            setTimeout(() => {
                this.dispatch('add');
            }, 500);
        }
    }
}, {
    plugins: [logger, devtools]
});

@inject(store)
class App extends React.Component {
    render() {
        const {count} = this.store.state;
        const {dispatch} = this.store;
        return (<div>
            {count}
            <button onClick={() => dispatch('add')}>add</button>
            <button onClick={() => dispatch('reduce')}>reduce</button>
            <button onClick={() => dispatch('asyncAdd')}>async</button>
        </div>);
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));