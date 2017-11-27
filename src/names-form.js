import React from 'react';
import Company from './company';

import './names-form.css';

export default class NamesForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {companies:[], tab: 'single', queried: false};
        this.height = window.innerHeight;
    }

    getUrl() {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            let url = window.serverUrl + '/companies?';
            let state = this.state;
            let names = [];

            if (state.tab === 'multi') {
                names = this.refs.massnametext.value.split('\n');
                this.refs.massnametext.value = '';
                names.forEach(name => {
                    if (name && name !== '') {
                        url += 'companies[]=' + encodeURIComponent(name) + '&';
                    }
                });

                //Cut off trailing ampersand
                url = url.slice(0,-1);
                
                state.queried = true;
            } else {
                url += 'companies[]=' + encodeURIComponent(this.refs.companyName.value);
                this.refs.companyName.value = '';
            }
            
            state.companies.push({name: 'loader', cssClass: 'loader', html: <div className='loading'></div>});
            this.setState(state);

            xhr.open('GET', url, true);
            xhr.send();
    
            let processRequest = event => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);
    
                    //Remove the loading icon
                    state.companies.pop();

                    if (response.data.length > 1) {
                        response.data.forEach((co,i) => {
                            let company = new Company(co.name);
                            company.url = co.domain;
                            state.companies.push(company);    
                        });
                    } else {
                        let co = new Company(response.data[0].name);
                        co.url = response.data[0].domain;

                        state.companies.push(co);
                    }

                    this.setState(state);
                    resolve();
                } else if (xhr.status !== 200) {
                    reject();
                }
            }
    
            xhr.onreadystatechange = processRequest;
        })
    }

    keyPressed(event) {
        if (event.key !== 'Enter') return;

        this.getUrl();
    }

    switchTab(event) {
        if (event.target.id !== this.state.tab) {
            let state = this.state;
            state.tab = event.target.id;
            state.companies = [];
            state.queried = false;
            this.setState(state);
        }
    }

    clearResults() {
        let state = this.state;
        state.companies = [];
        state.queried = false;
        this.setState(state);
    }

    render() {
        let area;

        if (this.state.tab === 'single') {
            area = 
                <div id='namearea'>
                    <ul id="nameslist">
                        {this.state.companies.map(i => <li className={i.cssClass} key={i.name}>{i.html}</li>)}
                    </ul>
                    <br />
                    <div id='nameinput'>
                        <div id='inputfield'>
                            <input ref="companyName" placeholder="Company Name" onKeyPress={this.keyPressed.bind(this)} />
                            <button className='navbutton' onClick={this.getUrl.bind(this)}>Add</button>
                        </div>
                        <small>Click 'Add' or press 'Enter' to add company name</small>
                    </div>
                </div>
        } else if (this.state.tab === 'multi') {
            if (this.state.queried) {
                area = 
                    <div id='massnamearea'>                   
                        <ul id="nameslist">
                            {this.state.companies.map(i => <li className={i.cssClass} key={i.name}>{i.html}</li>)}
                        </ul>
                        <button className='navbutton' onClick={this.clearResults.bind(this)}>Reset</button>
                    </div>
            } else {
                area = 
                    <div id='massnamearea'>
                        <textarea ref='massnametext' id='massnametext' rows='25' placeholder='Enter Company Names'></textarea>
                        <button className='navbutton' onClick={this.getUrl.bind(this)}>Get URLs</button>
                    </div>
            }
        }
        
        return (
            <div id='tabs'>
                <div id='nav'>
                    <button className='navbutton' id='single' onClick={this.switchTab.bind(this)}>Single</button>
                    <button className='navbutton' id='multi' onClick={this.switchTab.bind(this)}>Multi</button>
                </div>
                {area}
            </div>
        );
    }
}