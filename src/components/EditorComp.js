import React from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2'

export default class EditorComp extends React.Component {
  constructor(props) {
    super(props);
    this.editorInstance = null;
    this.textMarker = null;
  }

  componentDidUpdate() {
    this.textMarker && this.textMarker.clear();
    let doc = this.editorInstance.doc;
    let from = (this.props.highlightLine - 1) || 0;
    let to = this.props.highlightLine || 0;
    this.textMarker = doc.markText({line: from, ch: 0}, {line: to, ch: 0}, {className: this.props.highlightingClass});
  }

  render() {
    return (
      <CodeMirror editorDidMount={editor => {
        this.editorInstance = editor
      }} value={this.props.initialCode}
                  options={{lineNumbers: true, lineNumberFormatter: (a) => a * 10}}
                  onChange={(editor, value) => {
                    this.props.onEdit(editor.doc.getValue())
                  }} className="editor"/>
    )
  }
}
