import React from 'react';

export default class Company {
    constructor(name) {
        this.name = name.replace(/\b\w/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        this.url = '';
        this.cssClass = 'name';
    }

    get html() {
        return (
            <div>{this.name}&nbsp;<a href={this.url}>{this.url}</a></div>
        ); 
    }
}