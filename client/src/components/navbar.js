import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';
import { Navbar, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton } from './authComponents';

function NavBar(props) {
    return (
        <Navbar bg="success" variant="dark" fixed="top">
            <Container fluid>
                <Navbar.Brand>
                    <i className="bi bi-question-square" />
                    &nbsp;&nbsp;SolveMyRiddle
                </Navbar.Brand>
                <div>
                    <LogoutButton user={props.user} logout={props.logout} option={props.option}/>
                    &nbsp;&nbsp;&nbsp;
                    <Link to={'/login'}>
                        <Button bg="success" variant="outline-light">
                            <i className="bi bi-person-fill" />
                        </Button>
                    </Link>
                </div>
            </Container>
        </Navbar>
    );
}

export { NavBar };