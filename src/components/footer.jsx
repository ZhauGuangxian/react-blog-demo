import React,{Component} from 'react';

class Footer extends Component{
    constructor(props){
        super(props);
        this.cpoyRightYear = new Date().getFullYear()
    }

    render(){
        return(
            <footer className="commonFooter">
                <div className="text-center">
                    ©gaigai {this.cpoyRightYear}
                </div>
                <div className="text-center">
                    15578442072@163.com
                </div>
            </footer>
        )
    }
}

export default Footer