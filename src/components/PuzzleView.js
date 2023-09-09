import { useState, useEffect } from 'react';
import { useContext } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { PuzzleContext } from '../contexts/PuzzleContext.js';
import { ProgressContext } from '../contexts/ProgressContext.js';
import runJQ from '../contexts/PuzzleInfra.js'
import './PuzzleView.css';

//import * as acejs from 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.2/ace.js';
import AceEditor from "react-ace";

//PuzzleView includes objects of a single puzzle, such as the three boxes, input field, flavor text, etc
function PuzzleView() {
    const { currentPuzzle, getPuzzleLink } = useContext(PuzzleContext);
    const { setProgressWrapper, getProgress } = useContext(ProgressContext);

    const [puzzleJSON, setPuzzleJSON] = useState([]);//Type JSON. in and out are also type JSON
    const [outputString, setOutputString] = useState('');//Type String. Output after user JQ is ran
    const [targetString, setTargetString] = useState('');//Type string. Goal state
    const [storedQuery, setStoredQuery] = useState('');//Latest record from saved queries.
    const [currentlyMatches, setCurrentlyMatches] = useState("CORRECT");
    /* Effects:
    Page load -> getData (also triggered on tab switch) -> 
    {setPuzzleJSON -> runJQ(setTargetString)} -> setStoredQuery AND jqAndCheck(storedquery)
    onClick -> jqAndCheck(setOutputString)
    */

    //The function to run JQ, which uses code from PuzzleInfra
    const jqAndCheck = (jqInput) => { //Note that localOutputString is used for comparison but is not the same as outputString
        var localOutputString = runJQ(puzzleJSON.input, jqInput);
        setOutputString(localOutputString);
        var matchBool = false;
        if(targetString && localOutputString && targetString != '' && localOutputString != ''){
            if(localOutputString == targetString){
                if(passRegexCheck(jqInput)) matchBool = true;
            } else setCurrentlyMatches("INCORRECT");
            setProgressWrapper(currentPuzzle, jqInput, matchBool);
        } else {
            setCurrentlyMatches("INCORRECT");
        }
    }

    //For constraints - makes jq input "fail" if they do not follow the fules. As of Sep 2023, this feature is rarely used.
    const passRegexCheck = (jqInput) => {
        var check = true;
        var errors = "";
        if(puzzleJSON.restrictions!==undefined) puzzleJSON.restrictions.map((restrictionItem, restrictionIndex) => {
            var testCondition = new RegExp(restrictionItem.failcondition)
            var thisCheck = !testCondition.test(jqInput);
            if (thisCheck==false) errors+=restrictionItem.failmsg+"\n";
            check &= thisCheck;
        })
        if(check==true) setCurrentlyMatches("CORRECT");
        else setCurrentlyMatches("Matches but fails restrictions:\n"+errors)
        return check;
    }

    //Whenever new puzzle is loaded (by clicking on Navbar), reinitialize PuzzleView
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
    //Load in the new puzzle input, and generate the target output
    useEffect(() => {
        var localTargetString = runJQ(puzzleJSON.input, puzzleJSON.answer);
        setTargetString(localTargetString);
    }, [puzzleJSON])
    useEffect(() => {
        var localQuery = getProgress(currentPuzzle).query
        setStoredQuery(localQuery);
        jqAndCheck(localQuery);
    }, [targetString])

    //Says whether the current query is correct or not
    //Made redundant by <p>{getProgress(currentPuzzle).completed ? puzzleJSON.completedmessage : null}</p>
    const currentlyMatchHeader = (currentlyMatches) => {
        if(currentlyMatches) return(
            <p>CORRECT</p>
        )
        return (
            <p>INCORRECT</p>
        )
    }

    //Displays hints. Hints are barely made atm
    //It's more complicated because I want multiple hints that users reveal one at a time
    const hintsSection = () => {
        return(
            <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Click me for hints</Accordion.Header>
                <Accordion.Body>
                    <Tabs defaultActiveKey="" transition={false} id="noanim-tab-example" className="mb-3">
                    { (puzzleJSON.hints===undefined) ? null : puzzleJSON.hints.map((hintItem, hintIndex) => { //Each dropdown has all puzzles of that folder
                        return ( //Add PageContext logic
                        <Tab eventKey={hintIndex} title={hintIndex}>
                            {hintItem.text}
                        </Tab>
                        );
                    })}
                    {getProgress(currentPuzzle).completed ? <Tab eventKey="answer" title="Answer">{puzzleJSON.answer}</Tab> : null}
                    </Tabs>
                    </Accordion.Body>
            </Accordion.Item>
            </Accordion>
        )
    }

    //Run JQ when enter key is pressed
    const handleKeyPress = (target) => {
        if(target.charCode==13){
          var query = document.getElementById("query").value; jqAndCheck(query);
        } 
    }

    //Render screen
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
            <p>{getProgress(currentPuzzle).completed ? puzzleJSON.completedmessage : null}</p>
            {hintsSection()}
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">jq Input</InputGroup.Text>
                <Form.Control key={storedQuery} id="query" placeholder="." aria-label="query" aria-describedby="basic-addon1" defaultValue={storedQuery} onKeyPress={handleKeyPress}/>
                <Button variant="secondary" id="button-addon2" onClick={() => {var query = document.getElementById("query").value; jqAndCheck(query)}}>
                    Run JQ!
                </Button>
            </InputGroup>
            <p>Your answer is currently: {currentlyMatches}</p>
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
