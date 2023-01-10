import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import TabPane from 'react-bootstrap/TabPane';
import NavDropdown from 'react-bootstrap/NavDropdown';
import puzzleList from '../puzzleList.json'
import { PuzzleContext } from '../contexts/PuzzleContext.js';
import { ProgressContext } from '../contexts/ProgressContext.js';
import './Navbar.css';

export default function PuzzleNavBar() {
    const { currentPuzzle, setCurrentPuzzle } = useContext(PuzzleContext);
    const { progress, resetProgress } = useContext(ProgressContext);
    
    /*function chapterDropdown(){//Based on the puzzleList, create dropdowns for each folder
        return( //Actually the chapter tabs are Tabs, while the puzzle tabs are Navs
            puzzleList.map((folder) => { 
                return (//TODO: Does .map automatically sort by key IDs??
                <NavDropdown key={folder.chapter} title={folder.title} id="nav-dropdown">
                { folder.puzzles.map((puzzle) => { //Each dropdown has all puzzles of that folder
                    return ( //Add PageContext logic
                    <NavDropdown.Item key={puzzle.id} 
                        onClick={() => setCurrentPuzzle({
                            chapter: folder.chapter,
                            puzzle: puzzle
                        })}>{puzzle.title}
                    </NavDropdown.Item>
                    );
                })}
                </NavDropdown>
                )
            })
        );
    }*/

    const tabProgress = (chapterIndex,puzzleIndex = -1) => {
        if(puzzleIndex >= 0){
            if(progress[chapterIndex] != null){
                if(progress[chapterIndex][puzzleIndex] != null){
                    return progress[chapterIndex][puzzleIndex].completed ? "completedTab" : "incompleteTab"
                }
            }
        } else {
            if(progress[chapterIndex] != null){
                return progress[chapterIndex].completed ? "completedTab" : "incompleteTab"
            }
        }
        return "incompleteTab"
    }

    /*function puzzleTabs() {//Based on the current puzzle, show tabs. TODO: Color if complete
        return( 
            <Tabs className="chapterTabs" transition={false} defaultActiveKey={"c"+currentPuzzle.chapter.toString()}>
            { puzzleList.map((chapterEntry, chapterIndex) => {
                return (
                    <Tab className="chapterTab" eventKey={"c"+chapterIndex.toString()} key={chapterEntry.title} title={chapterEntry.title}>
                        <Nav variant="tabs" activeKey={currentPuzzle.puzzle ? "c"+chapterIndex.toString()+"t"+currentPuzzle.puzzle.toString() : null}>
                            { chapterEntry.puzzles.map((puzzleEntry, puzzleIndex) => { //Each dropdown has all puzzles of that folder
                                return ( //Add PageContext logic
                                <Nav.Item key={"c"+chapterIndex.toString()+"t"+puzzleIndex.toString()}>
                                    <Nav.Link className={tabProgress(chapterIndex,puzzleIndex)} eventKey={"c"+chapterIndex.toString()+"t"+puzzleIndex.toString()} onClick={() => 
                                        {
                                            var newPuzzle = {
                                                chapter: chapterIndex,
                                                puzzle: puzzleIndex
                                            }
                                            setCurrentPuzzle(newPuzzle);
                                        }
                                    }>
                                    {puzzleEntry.title} 
                                    </Nav.Link>
                                </Nav.Item>
                                );
                            })}
                        </Nav>
                    </Tab>
                );
            })}
            </Tabs>
        );
    }*/


        //TODO Tab Problems:
        //1. Active key persists across multiple chapters. Should only be active for one
        //2. First puzzle tab each chapter is never active
    function tabGenerate(){
        //Based off https://react-bootstrap.github.io/components/tabs/#custom-tab-layout
        //We build navSet and tabPaneSet independantly as they are necessarily 2 separate React elements, but logically should be generated together
        var navSet = [];
        var tabPaneSet = [];
        { puzzleList.map((chapterEntry, chapterIndex) => {
            navSet.push(
                <Nav.Item key={chapterEntry.title}>
                    <Nav.Link className={tabProgress(chapterIndex)} eventKey={"c"+chapterIndex.toString()}>{chapterEntry.title}</Nav.Link>
                </Nav.Item>
            )
            tabPaneSet.push(
                <Tab.Pane key={chapterEntry.title} eventKey={"c"+chapterIndex.toString()}>
                    {console.log("c"+currentPuzzle.chapter.toString()+"t"+currentPuzzle.puzzle.toString())}
                    <Nav variant="tabs" activeKey={currentPuzzle.puzzle!==null ? "c"+currentPuzzle.chapter.toString()+"t"+currentPuzzle.puzzle.toString() : null}>
                        { chapterEntry.puzzles.map((puzzleEntry, puzzleIndex) => { //Each dropdown has all puzzles of that folder
                            return ( //Add PageContext logic
                            <Nav.Item key={"c"+chapterIndex.toString()+"t"+puzzleIndex.toString()}>
                                <Nav.Link className={tabProgress(chapterIndex,puzzleIndex)} eventKey={"c"+chapterIndex.toString()+"t"+puzzleIndex.toString()} onClick={() => 
                                    {
                                        var newPuzzle = {
                                            chapter: chapterIndex,
                                            puzzle: puzzleIndex
                                        }
                                        setCurrentPuzzle(newPuzzle);
                                    }
                                }>
                                {puzzleEntry.title} 
                                </Nav.Link>
                            </Nav.Item>
                            );
                        })}
                    </Nav>
                </Tab.Pane>
            )
        })}
        return [navSet, tabPaneSet];
    }

    function puzzleTabs() {//Based on the current puzzle, show tabs. TODO: Color if complete
        var [navSet, tabpaneSet] = tabGenerate();
        return(
            <div className="puzzleTabs">
                <Tab.Container id="left-tabs-example" defaultActiveKey={"c"+currentPuzzle.chapter.toString()}>
                    <Nav variant="tabs">
                        {navSet}
                    </Nav>
                    <Tab.Content>
                        {tabpaneSet}
                    </Tab.Content>
                </Tab.Container>
            </div>
        );
    }

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Nav variant="pills">
                </Nav>
                <Container>
                    <Navbar.Brand>jqwitness Puzzles</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#about">About</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link onClick={() => resetProgress()}>RESET PROGRESS</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
                <Nav variant="pills">
                </Nav>
            </Navbar>
            {puzzleTabs()}
        </>
    );
}