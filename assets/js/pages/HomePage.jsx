import React from 'react';
const HomePage = (props) => {
    return ( 
        <div className="card text-white bg-primary mb-3" style={{maxWidth: "20rem"}}>
            <div className="card-header">Home</div>
            <div className="card-body">
                <h4 className="card-title">Primary card title</h4>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
        </div> 
    );
}
 
export default HomePage;