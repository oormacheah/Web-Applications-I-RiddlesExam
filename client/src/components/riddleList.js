import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Table, Row, Col, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function RiddleList(props) {
    const riddles = props.riddles;
    // set attempted property for each riddle as true or false
    if (props.attempted.length > 0) {
        for (let i=0; i<riddles.length; i++) {
            if (props.attempted.find(id => id === riddles[i].id)) {
                riddles[i].attempted = true;
            }
            else {
                riddles[i].attempted = false;
            }
        }
    }
    else {
        for (let i=0; i<riddles.length; i++) {
            riddles[i].attempted = false;
        }
    }


    const riddleElements = riddles.map(riddle => {
        return (
            <RiddleRow option={props.option} id={riddle.id} key={riddle.id} question={riddle.question} attempted={riddle.attempted}
                difficulty={riddle.difficulty} state={riddle.state} user={props.user} getReplies={props.getReplies}/>
        );
    });

    return (
        <>
            {props.msg && <Row>
                <Alert variant={props.msg.type} onClose={() => props.setMessage('')}
                    dismissible>{props.msg.msg}</Alert>
            </Row>}
            <ListOverhead option={props.option} />
            <Table hover>
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Difficulty</th>
                        <th>State</th>
                        {props.user.id ? <th>Action</th> : <></>}
                    </tr>
                </thead>
                <tbody>
                    {riddleElements}
                </tbody>
            </Table>
        </>
    );
}

function RiddleRow(props) {
    const navigate = useNavigate();
    return (
        <tr key={props.id}>
            <td key={props.question}>{props.question}</td>
            <td key={props.difficulty}>{props.difficulty}</td>
            <td key={props.state} className={props.state ? "greentext" : "redtext"}>
                {props.state ? "Open" : "Closed"}
            </td>
            {props.user.id ? 
                <td key={props.option}>
                    <Button bg="light"
                        variant={props.option === 'My Riddles' ? "dark" : (props.state ? "success" : "primary")} 
                        disabled={props.attempted && props.state}
                        onClick={async () => { 
                            if (props.option === 'My Riddles') {
                                await props.getReplies(props.id);
                                navigate(`/myriddles/${props.id}`);
                            }
                            else {
                                if (!props.state) {
                                await props.getReplies(props.id);
                                }
                                navigate(`/riddles/${props.id}`);
                            }
                            }}>
                        {props.option === 'My Riddles' ? <i className="bi bi-eye"></i> : 
                        (props.state ? <i className="bi bi-play-circle"></i> : <i className="bi bi-eye"/>)}
                    </Button>
                </td>
                : <></>
            }
        </tr>
    );
}

function ListOverhead(props) {
    const navigate = useNavigate();
    return (
        <Col className="listoverhead">
            {props.option === 'My Riddles' ?
                <>
                    <h1>My Riddles&nbsp;&nbsp;<Button variant="success"
                        onClick={() => navigate('/new')}>New Riddle</Button></h1>
                </>
                : <h1>Riddles</h1>
            }
        </Col>
    );
}

export { RiddleList };

/*
                    <tr>
                        <td>What's My Name Motherfucker?</td>
                        <td>Hard</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <td>Larry the Bird</td>
                        <td>@twitter</td>
                    </tr>
*/