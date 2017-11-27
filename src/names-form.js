import React from 'react';
import Company from './company';

import './names-form.css';

/**
 * The vast majority of the app functionality lives in this class.
 * TODO: break up the logic into more discrete code blocks
 */
export default class NamesForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {companies:[], tab: 'single', queried: false};
        this.height = window.innerHeight;
    }

    /**
     * This is where the requests are sent and responses handled
     * for company names and domains.Returns a promise
     */
    getUrl() {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            let url = window.serverUrl + '/companies?';
            let state = this.state;
            let names = [];

            //If we're on the multi tab then we have a textarea as input
            if (state.tab === 'multi') {
                //TODO: handle splitting on multiple characters
                names = this.refs.massnametext.value.split('\n');
                this.refs.massnametext.value = '';

                //Encode URL. Company names can have reserved and unsafe characters
                names.forEach(name => {
                    if (name && name !== '') {
                        url += 'companies[]=' + encodeURIComponent(name) + '&';
                    }
                });

                //Cut off trailing ampersand
                url = url.slice(0,-1);
                
                state.queried = true;
            } else {
                //If we're on the single tab, then we only have one name to worry about
                url += 'companies[]=' + encodeURIComponent(this.refs.companyName.value);
                this.refs.companyName.value = '';
            }
            
            //This displays the loading spinner
            state.companies.push({name: 'loader', cssClass: 'loader', html: <div className='loading'></div>});
            this.setState(state);

            xhr.open('GET', url, true);
            xhr.send();
    
            //This is the callback for the xhr data event
            let processRequest = event => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);
    
                    //Remove the loading icon
                    state.companies.pop();

                    response.data.forEach((co,i) => {
                        let company = new Company(co.name);
                        company.url = co.domain;
                        state.companies.push(company);    
                    });
    
                    //The state now contains all company names and urls
                    this.setState(state);
                    resolve();
                } else if (xhr.status !== 200) {
                    reject();
                }
            }
    
            xhr.onreadystatechange = processRequest;
        });
    }

    keyPressed(event) {
        if (event.key !== 'Enter') return;

        this.getUrl();
    }

    /**
     * When we switch the tabs, we want to clear the queried state and companies
     * @param {*} event 
     */
    switchTab(event) {
        if (event.target.id !== this.state.tab) {
            let state = this.state;
            state.tab = event.target.id;
            state.companies = [];
            state.queried = false;
            this.setState(state);
        }
    }

    /**
     * Clear the search results on the multi tab
     */
    clearResults() {
        let state = this.state;
        state.companies = [];
        state.queried = false;
        this.setState(state);
    }

    render() {
        let area;

        //We need to display a different area depending on which tab we're in
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
            //If we've sent the query, then we need to show the loader or search results
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