import React from 'react';
import FacebookLogin from 'react-facebook-login'

export default class SimpleCounter extends React.Component {
    constructor() {
        super();
        this.state = {
            count: 0
        };
    }

    incrementCount() {
        console.log("Incrimenting")
        this.setState({ count: this.state.count + 1 });
    }

    render() {
        const responseFacebook = (response) => {
              console.log(response);
        }

        return (
            <div>
                <h1>test</h1>
                <button onClick={this.incrementCount.bind(this)}>
                Count: {this.state.count}
                </button>
                <FacebookLogin
                    appId="107162943325268"
                    autoLoad={true}
                    fields="name,email,picture"
                    callback={responseFacebook}
                    cssClass="my-facebook-button-class"
                    icon="fa-facebook"
                />
            </div>
        );
    }
}
