import React from 'react';

/**
 * Simple wrapper class for a name + url couplet. Processing is done on the name that is passed in
 * to capitalize the first letter of each word. To make it look good
 */
export default class Company {
    constructor(name) {
        this.name = name.replace(/\b\w/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        this.url = '';
        this.cssClass = 'name';
    }

    /**
     * This is what is shown inside of each list item
     * TODO: Make this look not terrible
     */
    get html() {
        return (
            <div>{this.name}&nbsp;<a href={this.url}>{this.url}</a></div>
        ); 
    }
}