import { useState, useEffect } from 'react';
import { useContext } from 'react';
import * as Form2 from 'react-bootstrap/Form';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { PuzzleContext } from '../contexts/PuzzleContext.js';
import { ProgressContext } from '../contexts/ProgressContext.js';
import runJQ from '../contexts/PuzzleInfra.js'
import './PuzzleView.css';

//import * as acejs from 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.2/ace.js';
import AceEditor from "react-ace";

function PuzzleView() {
    const { currentPuzzle, getPuzzleLink } = useContext(PuzzleContext);
    const { setProgressWrapper, getProgress } = useContext(ProgressContext);

    const [puzzleJSON, setPuzzleJSON] = useState([]);//Type JSON. in and out are also type JSON
    const [outputString, setOutputString] = useState('');//Type String
    const [targetString, setTargetString] = useState('');
    const [storedQuery, setStoredQuery] = useState('');//Latest record from saved queries.
    const [currentlyMatches, setCurrentlyMatches] = useState(false);
    /* Effects:
    Page load -> getData (also triggered on tab switch) -> 
    {setPuzzleJSON -> runJQ(setTargetString)} -> setStoredQuery AND jqAndCheck(storedquery)
    onClick -> jqAndCheck(setOutputString)
    */

    const jqAndCheck = (jqInput) => { //Note that localOutputString is used for comparison but is not the same as outputString
        var localOutputString = runJQ(puzzleJSON.input, jqInput);
        setOutputString(localOutputString);
        var matchBool = false;
        if(targetString && localOutputString && targetString != '' && localOutputString != ''){
            if(localOutputString == targetString){
                matchBool = true;
                setCurrentlyMatches(true);
            } else 
            setCurrentlyMatches(false);
            setProgressWrapper(currentPuzzle, jqInput, matchBool);
        }
    }
    useEffect(() => {
        console.log(JSON.stringify(currentPuzzle));
        getData();
    }, [currentPuzzle])
    const getData = () => {
        fetch(getPuzzleLink(), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        )
            .then(function (response) {
                return response.json();
            })
            .then(function (puzzleJSON) {
                setPuzzleJSON(puzzleJSON);
            })
    }
    useEffect(() => {
        var localTargetString = runJQ(puzzleJSON.input, puzzleJSON.answer);
        setTargetString(localTargetString);
    }, [puzzleJSON])
    useEffect(() => {
        var localQuery = getProgress(currentPuzzle).query
        setStoredQuery(localQuery);
        jqAndCheck(localQuery);
    }, [targetString])


    const currentlyMatchHeader = (currentlyMatches) => {
        if(currentlyMatches) return(
            <p>CORRECT</p>
        )
        return (
            <p>INCORRECT</p>
        )
    }

    return (
        <div className="puzzleArea">
            {        
            /*<AceEditor//TODO???
            mode="plain_text"
            theme="github"
            onChange={() => {}}
            name="UNIQUE_ID_OF_DIV"
            showGutter={false}
            wrapEnabled={true}
            highlightActiveLine={false}
            editorProps={{ $blockScrolling: true }}
            enableBasicAutocompletion={true}
            enableLiveAutocompletion={true}
            setOptions={{
                enableSnippets: true,
                // fontFamily: "tahoma",
                fontSize: "10pt"
            }}
            />*/}
            
            <p>{puzzleJSON.message}</p>
            {currentlyMatchHeader(currentlyMatches)}
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">jq Input</InputGroup.Text>
                <Form.Control key={storedQuery} id="query" placeholder="." aria-label="query" aria-describedby="basic-addon1" defaultValue={storedQuery}/>
                <Button variant="secondary" id="button-addon2" onClick={() => {var query = document.getElementById("query").value; jqAndCheck(query)}}>
                    Run JQ!
                </Button>
            </InputGroup>
            <Form.Text id="sometext" muted>
                hints maybe
            </Form.Text>
            <Row className="mb-3">
                <Form.Group as={Col}>
                    <Form.Label>Input JSON</Form.Label>
                    <Form.Control as="textarea" disabled value={JSON.stringify(puzzleJSON.input, null, 2)} style={{ height: '512px' }} />
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Output JSON</Form.Label>
                    <Form.Control as="textarea" disabled value={outputString} style={{ height: '512px' }}>
                    </Form.Control>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Target</Form.Label>
                    <Form.Control as="textarea" disabled value={targetString} style={{ height: '512px' }} />
                </Form.Group>
            </Row>
        </div>
    );
}

export default PuzzleView;
