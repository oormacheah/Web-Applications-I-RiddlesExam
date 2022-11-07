import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';

function SideBar(props) {
    const navigate = useNavigate();
    return (
        <>
            <i className="bi bi-person-circle myusericon" />
            <div>User:&nbsp;
                <span className={props.user.id ? "" : "bold"}>
                    {props.user.id ? props.nameScore.name : "nobody"}
                </span>
            </div>
            <p>Points: {props.nameScore.score}</p>
            <ListGroup as="ul" variant="flush">
                <ListGroup.Item as="li" action active={props.option === 'Riddles'}
                    onClick={() => { props.setOption('Riddles'); navigate('/') }}
                    variant="success">Riddles</ListGroup.Item>
                <ListGroup.Item as="li" action active={props.option === 'Top 3'}
                    onClick={() => { props.setOption('Top 3'); navigate('/top3') }}
                    variant="success">Top Players</ListGroup.Item>
                <ListGroup.Item as="li" disabled={!props.user.id ? true : false} action
                    onClick={() => { props.setOption('My Riddles'); navigate('/myriddles') }}
                    active={props.option === 'My Riddles'} variant="success">My Riddles</ListGroup.Item>
            </ListGroup>
        </>
    );
}

export { SideBar };