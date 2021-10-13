import React, { Component } from 'react';


class Clock extends Component {
    interval1 = 0;
    constructor(props) {
        super(props);
        this.state = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            dateNow: 0,
        }
        this._isMounted = false;
    }


    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.interval1 = setInterval(() => this.getTimeUntil(this.props.deadline), 1000)
        }
    }

    async getTimeUntil(deadline) {
        if (this._isMounted) {
            const dateTime = Date.now();
            const dateNow = Math.floor(dateTime / 1000);
            const time = await Date.parse(deadline) - Date.parse(new Date());
            const seconds = await Math.floor((time / 1000) % 60);
            const minutes = await Math.floor((time / 1000 / 60) % 60);
            const hours = await Math.floor(time / (1000 * 60 * 60) % 24);
            const days = await Math.floor(time / (1000 * 60 * 60 * 24));
            this.setState({ days, hours, minutes, seconds, dateNow });
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval1)
        this._isMounted = false;
    }

    render() {
        if (this.props.event_unix < this.state.dateNow)
            return (
                <div className="justify-content-center">
                    <div className="countdownEnded">
                        <div className="box">
                            <p className="mb-1">
                                <span>⚠️ This event has already ended.</span>
                            </p>
                        </div>
                    </div>
                </div>);

        else
            return (
                <div className="countdown">
                    <div className="box">
                        <h5 className="mb-1">Event Begins In</h5>
                    </div>

                    <div className="clock">
                        <div><span>{this.state.days} </span><p>Days</p> </div>
                        <div><span>{this.state.hours} </span>  <p>Hours</p></div>
                        <div> <span>{this.state.minutes}</span>  <p>Minutes</p></div>
                        <div> <span>{this.state.seconds} </span> <p>Seconds</p></div>
                    </div>
                </div>
            );
    }
}
export default Clock;