import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useState } from 'react';

function RiddleForm(props) {
    const navigate = useNavigate();
    const [reply, setReply] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!props.riddle.endTime) {
            props.setEndTime(props.riddle.id, props.currentTime.add(props.riddle.duration, 'second'));
        }
        const newReply = { riddleID: props.riddle.id, reply: reply };
        if (reply.toLowerCase() === props.riddle.answer.toLowerCase()) {
            newReply.correct = true;
            switch (props.riddle.difficulty) {
                case 'Easy':
                    newReply.points = 1;
                    break;
                case 'Average':
                    newReply.points = 2;
                    break;
                case 'Difficult':
                    newReply.points = 3;
                    break;
                default:
                    break;
            }
        }
        props.addReply(newReply);
        navigate('/');
    }

    return (
        <Row>
            <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                    <Form.Label>Your reply:</Form.Label>
                    <Form.Control size='sm' type='text' required={true} value={reply}
                        onChange={event => setReply(event.target.value)} />
                </Form.Group>
                <Button variant='success' type='submit'>Submit&nbsp;&nbsp;<i className={'bi bi-upload'} /></Button>&nbsp;&nbsp;
                <Button variant='danger' onClick={() => navigate('/')}>Cancel</Button>
            </Form>
        </Row>

    );
}

function NewRiddleForm(props) {

    const navigate = useNavigate();

    const [question, setQuestion] = useState('');
    const [difficulty, setDifficulty] = useState('Average');
    const [duration, setDuration] = useState('');
    const [answer, setAnswer] = useState('');
    const [hint1, setHint1] = useState('');
    const [hint2, setHint2] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const newRiddle = {
            id: 0, // purpose is having a unique id while updating locally (before fetching db) and not
            // have a warning of non-uniqueness of the key
            question: question,
            difficulty: difficulty,
            duration: duration,
            answer: answer,
            hint1: hint1,
            hint2: hint2
        };
        props.addRiddle(newRiddle);
        navigate('/myriddles');
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Container>
                <Row>
                    <Form.Group>
                        <Form.Label>Question</Form.Label>
                        <Form.Control type='text' required value={question}
                            onChange={(event) => setQuestion(event.target.value)} />
                    </Form.Group>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Difficulty</Form.Label>
                            <Form.Select value={difficulty}
                                onChange={(event) => setDifficulty(event.target.value)}>
                                <option>Easy</option>
                                <option>Average</option>
                                <option>Difficult</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Duration</Form.Label>
                            <Form.Control type='number' value={duration} required min={60} max={600}
                                onChange={(event) => setDuration(event.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Answer</Form.Label>
                            <Form.Control type='text' value={answer} required
                                onChange={(event) => setAnswer(event.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Hint 1</Form.Label>
                            <Form.Control type='text' required value={hint1}
                                onChange={(event) => setHint1(event.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Hint 2</Form.Label>
                            <Form.Control type='text' required value={hint2}
                                onChange={(event) => setHint2(event.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Button variant="success" type="submit">Add&nbsp;<i className={'bi bi-upload'} /></Button>
                &nbsp;&nbsp;
                <Button variant="danger" onClick={() => navigate('/myriddles')}>Cancel</Button>
            </Container>
        </Form>
    );

}

export { RiddleForm, NewRiddleForm };
