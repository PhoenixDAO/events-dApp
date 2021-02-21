import React from 'react';
import {Button,Container} from 'react-bootstrap';
function PageNotFound() {
    return (
        <div className="mt-5 text-center">
			<h3 className="mt-5">OOPS !!! PAGE NOT FOUND</h3>
			<p className="emoji"><span role="img" aria-label="worried face"> 😟</span></p>
               <p>That page doesn't exist or is unavailable</p>

		</div>
        // <Container>
        //     <h1>NOT FOUND</h1>
        //     <h3></h3>
        //     <p>THAT PAGE DOESN'T EXIST OR IS UNAVAILABLE</p>
        //     <Button variant="primary" size="lg">Back To Home</Button>
        //     </Container>
    );
}

export default PageNotFound;