import React from 'react';
import ReactDOM from 'react-dom';
import HelloWorld from './HelloWorld';
import store from './redux-db';
import TaskMenu from './react-taskmenu';
import {TaskDisplay} from './react-taskdisplay';
import TaskModal from './react-modal';
import {MobileMenu, MobileDisplay} from './react-mobile';


import "./index.css";

ReactDOM.render(
    <HelloWorld/>, 
    document.getElementById('root')
);

