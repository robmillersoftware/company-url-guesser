import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import NamesForm from './names-form';
import Company from './company';

it('can clear company names and the queried state', () => {
    const names = ReactTestUtils.renderIntoDocument(<NamesForm />);

    names.state.companies = [1, 2, 3];
    names.state.queried = true;

    names.clearResults();

    expect(names.state.companies.length).toEqual(0);
    expect(names.state.queried).toBe(false);
});

it('can handle reserved characters in company names', () => {
    const names = ReactTestUtils.renderIntoDocument(<NamesForm />);

    ['$','&','+',',','/',':',';','=','?','@'].forEach((char) => {
        names.state.companies.push(new Company('test ' + char + ' test'));
    });
    
    names.getUrl().then(() => {
        names.state.companies.forEach(co => {
            expect(co.url).toBeTruthy();
        });
    }).catch(err => console.log(err));
});

it('can handle unsafe characters in company names', () => {
    const names = ReactTestUtils.renderIntoDocument(<NamesForm />);

    [' ', '"', '<', '>', '#', '%', '{', '}', '|', '\\', '^', '~', '[', ']', '`'].forEach((char) => {
        names.state.companies.push(new Company('test ' + char + ' test'));
    });

    names.getUrl().then(() => {
        names.state.companies.forEach(co => {
            expect(co.url).toBeTruthy();
        });
    }).catch(err => console.log(err));
});