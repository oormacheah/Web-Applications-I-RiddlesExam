import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Alert, Table, Button } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { NavBar } from './navbar'
import { RiddleList } from './riddleList';
import { NewRiddleForm, RiddleForm } from './riddleForms';
import { LoginForm } from './authComponents';
import { SideBar } from './sidebar';
import { Top3List } from './top3List';
import { useEffect } from 'react';

function MainRoute(props) {
    useEffect(() => {
        props.setOption(props.option);
    });
    return (
        <>
            <Row>
                <NavBar user={props.user} logout={props.logout} option={props.option}/>
            </Row>
            <Row className="after_navbar">
                <Container fluid>
                    <Row>
                        <Col xs={2}>
                            <SideBar user={props.user} option={props.option} setOption={props.setOption} nameScore={props.nameScore} />
                        </Col>
                        <Col>
                            {props.option === 'Top 3' ? <Top3List top3={props.top3} msg={props.msg}
                                setMessage={props.setMessage} />
                                : <RiddleList option={props.option} user={props.user} riddles={props.riddles}
                                    msg={props.msg} setMessage={props.setMessage}
                                    getReplies={props.getReplies} attempted={props.attempted} />}
                        </Col>
                    </Row>
                </Container>
            </Row>
        </>
    );
}

function MyRiddleRoute(props) {
    const { riddleID } = useParams();
    const riddle = props.riddles.find(riddle => riddle.id === parseInt(riddleID));
    return (
        <>
            <Container>
                {props.msg && <Row>
                    <Alert variant={props.msg.type} onClose={() => props.setMessage('')}
                        dismissible>{props.msg.msg}</Alert>
                </Row>}
                <Row>
                    <h1>Your Riddle</h1>
                    {!riddle.state ? <h2>Riddle Results</h2> : <></>}
                    <h4>Q:&nbsp;{riddle.question}</h4>
                </Row>
                <br />
                {riddle.state ? <OpenRiddleView riddle={riddle} mine={true} replies={props.replies} 
                                                currentTime={props.currentTime}/> :
                    <ClosedRiddleView riddle={riddle} replies={props.replies}/>}
                <Link to={'/myriddles'}>
                    <Button variant="success">Back</Button>
                </Link>
            </Container>
        </>
    );
}

function OthersRiddleRoute(props) {
    const { riddleID } = useParams();
    const riddle = props.riddles.find(riddle => riddle.id === parseInt(riddleID));
    if (riddle === undefined) {
        return <></>;
    }

    return (
        <>
            <Container>
                {props.msg && <Row>
                    <Alert variant={props.msg.type} onClose={() => props.setMessage('')}
                        dismissible>{props.msg.msg}</Alert>
                </Row>}
                <Row>
                    {riddle.state ? <h1>Your shot</h1> : <h1>Riddle Results</h1>}
                    <h4>Q:&nbsp;{riddle.question}</h4>
                </Row>
                <br />
                {riddle.state ? <OpenRiddleView riddle={riddle} mine={false} riddles={props.riddles}
                    addReply={props.addReply} currentTime={props.currentTime} setEndTime={props.setEndTime}/>
                    : <ClosedRiddleView riddle={riddle} replies={props.replies} />}
                <br/>
                {riddle.state ? <></> :
                <Link to={`/`}>
                    <Button variant="success">Back</Button>
                </Link>
                }
            </Container>
        </>
    );
}

function OpenRiddleView(props) {
    let remainingTime;
    let hint1 = false;
    let hint2 = false;
    // console.log(props.currentTime.format('YYYY-MM-DD hh:mm:ss'));
    if (props.riddle.endTime) {
        remainingTime = props.riddle.endTime.diff(props.currentTime.format('YYYY-MM-DD hh:mm:ss'), 'second');
        if (remainingTime <= 0) {
            remainingTime = 0;
        }
        if (remainingTime < (props.riddle.duration / 2)) {
            hint1 = true;
            if (remainingTime < (props.riddle.duration / 4)) {
                hint2 = true;
            }
        }
    } 
    return (
        <>
            <h3>Remaining time: {props.riddle.endTime ? remainingTime : 'Take your time'}</h3>
            <br />
            {!props.mine ? <>
                <RiddleHints riddle={props.riddle} hint1={hint1} hint2={hint2}/>
                <br />
                {remainingTime === 0 ? 
                <h2>Timer expired, please go back!</h2> :
                <RiddleForm addReply={props.addReply} riddle={props.riddle} riddles={props.riddles} 
                            setEndTime={props.setEndTime} currentTime={props.currentTime}/>
                }
                {remainingTime === 0 ? 
                <Link to={'/'}>
                    <Button variant="success">Back</Button>
                </Link>: <></>}
                
            </> : <></>}
            {props.mine ? <>
                <h4 className="greentext">A: {props.riddle.answer}</h4>
                <h4>Other users are replying:</h4>
                <RiddleReplies riddle={props.riddle} replies={props.replies}/>
            </> : <></>}
        </>
    );
}

function ClosedRiddleView(props) {
    return (
        <>
            <h4 className="greentext">A: {props.riddle.answer}</h4>
            <h6>Winner: {props.riddle.winnerID ? props.riddle.winnerName : 'None'}</h6>
            <h3>Users replied:</h3>
            <RiddleReplies replies={props.replies} />
        </>
    );
}

function RiddleHints(props) {
    return (
        <Row>
            {props.hint1 ? <>
                <h4 className="greentext">Hint 1:</h4>
                <h6>{props.riddle.hint1}</h6></>
                : <></>}
            {props.hint2 ? <>
                <h4 className="greentext">Hint 2:</h4>
                <h6>{props.riddle.hint2}</h6>
            </> : <></>}
            
        </Row>
    );
}

function RiddleReplies(props) {
    return (
        <Table striped>
            <tbody>
                {props.replies}
            </tbody>
        </Table>
    );
}

function NewRiddleRoute(props) {
    return (
        <Row>
            <h1>New Riddle</h1>
            <NewRiddleForm addRiddle={props.addRiddle} />
        </Row>
    );
}

function LoginRoute(props) {
    return (
        <>
            <Row>
                {props.msg && <Row>
                    <Alert variant={props.msg.type} onClose={() => props.setMessage('')} dismissible>{props.msg.msg}</Alert>
                </Row>}
                <Col>
                    <h1>Login</h1>
                </Col>
            </Row>
            <Row>
                <LoginForm login={props.login} />
            </Row>
        </>
    );
}

export { MainRoute, MyRiddleRoute, OthersRiddleRoute, LoginRoute, NewRiddleRoute };