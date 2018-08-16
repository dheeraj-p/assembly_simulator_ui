import React, {Component} from 'react';
import MessageBox from "./MessageBox";
import Machine from '@craftybones/assembly_simulator';
import {INITIALCODE, INITIALMESSAGE} from "./constants";
import helpers from "./helpers";
import EditorComp from "./EditorComp";
import PrintTable from "./PrintTable";
import CustomTable from "./CustomTable";

require('codemirror/lib/codemirror.css');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      machine: new Machine(),
      editor: INITIALCODE,
      registerTable: [],
      message: INITIALMESSAGE,
      prints: []
    };
    this.executeCode = this.executeCode.bind(this);
    this.handleCodeEdit = this.handleCodeEdit.bind(this);
    this.setHasChangedPropertyForChangedRows = this.setHasChangedPropertyForChangedRows.bind(this);
  }

  handleCodeEdit(editor) {
    this.setState({editor})
  }

  render() {
    let app = this;
    return (
        <div className="app">
          <div className="codeSection">
            <EditorComp initailCode={INITIALCODE} onEdit={this.handleCodeEdit}/>
            <MessageBox message={this.state.message}/>
            <button onClick={this.executeCode}>Execute</button>
          </div>
          <div className="outputSection">
            <PrintTable prints={this.state.prints}/>
            <CustomTable rows={this.state.registerTable} headers={helpers.getColumns()} className="registerTable"
                         onClickOfHeader={this.setHasChangedPropertyForChangedRows}/>
          </div>
        </div>
    );
  }

  setHasChangedPropertyForChangedRows(event) {
    let columnId = event.target.id;
    let registerTable = this.state.registerTable;
    let previousState = (registerTable[0]) ? registerTable[0][columnId] : undefined;
    registerTable.forEach((row, rowIndex) => {
      let onChange = this.setHasChangedAs.bind(this, rowIndex, true);
      let onNotChange = this.setHasChangedAs.bind(this, rowIndex, false);
      let currentState = row[columnId];
      //Think about name for this function : Here you are not only comparing but also executing onChange or onNotChange function
      helpers.compareState(currentState, previousState, onChange, onNotChange);
      previousState = row[columnId];
    });
  }

  setHasChangedAs(rowIndex, state) {
    let registerTable = this.state.registerTable;
    registerTable[rowIndex].hasChanged = state;
    this.setState({registerTable});
  }

  executeCode() {
    let lines = this.state.editor.split(/\n/);
    let numberedCode = lines.map((l, i) => `${(i + 1) * 10} ${l.trim()}`).join("\n");
    let machine = this.state.machine;
    try {
      machine.load(numberedCode);
      machine.execute();
      this.setState({registerTable: machine.getTable(), message: INITIALMESSAGE});
      this.setState({prints: machine.getPrn()});
    } catch (e) {
      this.setState({message: e, registerTable: []})
    }
  }
}

export default App;
