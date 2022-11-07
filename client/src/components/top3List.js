import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Table, Row, Alert } from 'react-bootstrap';

function Top3List(props) {
    const top3Elements = props.top3.map(user => {
        return (
            <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.score}</td>
            </tr>
        );
    });
    return (
        <>
            {props.msg && <Row>
                <Alert variant={props.msg.type} onClose={() => props.setMessage('')}
                    dismissible>{props.msg.msg}</Alert>
            </Row>}
            <h1>Top 3</h1>
            <Table hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {top3Elements}
                </tbody>
            </Table>
        </>
    );
}


export { Top3List };