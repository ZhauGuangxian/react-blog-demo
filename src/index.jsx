import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.jsx';
import ManageHome from './views/manage/home.jsx'
import { BrowserRouter,  Route ,Switch} from 'react-router-dom';


ReactDOM.render(

        <BrowserRouter>
            <Switch>
                <Route path="/manage" component={ManageHome} />
                <Route component={App} />
            </Switch>

        </BrowserRouter>

    ,
    document.getElementById('root')
);