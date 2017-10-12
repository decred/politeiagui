/*!
 * react-markdown-editor-hybrid v0.3.0 (https://github.com/jaszhix/react-markdown-editor-hybrid)
 * Thanks to react-markdown-editor-hybrid for this package, unfortunately was in conflict with react 16.0
 * Licensed under MIT (https://github.com/jaszhix/react-markdown-editor-hybrid/blob/master/LICENSE)
 */
import React from 'react';
import PropTypes from 'prop-types';
import objectAssign from 'object-assign';

class MDEditor extends React.Component {
  static defaultProps = {
    enableHTML: true,
    textAreaStyle: {},
    buttonStyle: {},
    buttonContainerStyle: {}
  }
  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    cols: PropTypes.number.isRequired,
    rows: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
    enableHTML: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    textAreaStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    buttonContainerStyle: PropTypes.object
  }
  constructor(props){
    super(props)
    this.state = {
      preview: false
    };
  }
  setCaretPosition = (caretPos) => {
    let textarea = this.refs.text;
    if (textarea !== null) {
      if (textarea.createTextRange) {
        let range = textarea.createTextRange();
        range.move('character', caretPos);
        range.select();
      } else {
        if (textarea.selectionStart) {
          textarea.focus();
          textarea.setSelectionRange(caretPos, caretPos);
        } else {
          textarea.focus();
        }
      }
    }
  }
  getSelection = (value) => {
    let cursorIndexStart = this.refs.text.selectionStart;
    let cursorIndexEnd = this.refs.text.selectionEnd;
    let selection = value.substring(cursorIndexStart, cursorIndexEnd);
    return {
      cursorIndexStart: cursorIndexStart,
      cursorIndexEnd: cursorIndexEnd,
      selection: selection
    };
  }
  insertAtCursor = (e, markdownLeftOrLR, right, _selection, markdownRight, cursorPosOffset) => {
    if (e) {
      e.preventDefault();
    }
    let value = this.props.value;
    let selectionProps = this.getSelection(value);
    let cursorIndexStart = selectionProps.cursorIndexStart;
    let cursorIndexEnd = selectionProps.cursorIndexEnd;
    let selection = _selection ? _selection : selectionProps.selection;
    value = value.substring(0, cursorIndexStart)
      + `${markdownLeftOrLR}${selection.length > 0 ? selection : ''}${right ? markdownRight ? markdownRight :  markdownLeftOrLR : ''}`
      + value.substring(cursorIndexEnd, value.length);
    this.props.onChange(value);
    if (selection.length === 0) {
      setTimeout(()=>{
        this.setCaretPosition(cursorIndexStart + markdownRight ? cursorIndexEnd + cursorPosOffset : markdownLeftOrLR.length);
      }, 0);
    }
  }
  handleList = (e, ordered) => {
    e.preventDefault();
    let list = this.getSelection(this.props.value).selection.split(/\r?\n/);
    let newList = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].length > 0) {
        newList.push(`${ordered ? i + 1 + '.' : '-'} ${list[i]}`);
      }
    }
    newList = newList.join('\n');
    this.insertAtCursor(null, '', false, newList);
  }
  handleYoutube = (e) => {
    e.preventDefault();
    let url = prompt('Enter a YouTube URL.');
    let videoId = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    if (videoId === null) {
      return;
    }
    this.insertAtCursor(null, `[![](https://img.youtube.com/vi/${videoId[1]}/0.jpg)](https://www.youtube.com/watch?v=${videoId[1]}`, true, null, ')', 4);
  }
  handleTogglePreview = (e) => {
    e.preventDefault();
    this.setState({preview: !this.state.preview});
  }
  handleTextChange = (e) => {
    this.props.onChange(e.target.value);
  }
  render(){
    let p = this.props;
    const textAreaStyle = {
      width: '100%',
      outline: '0',
      border: '1px solid #cccccc',
      height: '500px',
      padding: '4px 8px'
    };
    objectAssign(textAreaStyle, p.textAreaStyle);
    const buttonStyle = {
      outline: '0',
      border: '1px solid #cccccc',
      margin: '0px 2px',
      padding: '4px 8px',
      cursor: 'pointer',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFF',
      marginLeft: '4px',
      lineHeight: '1'
    };
    objectAssign(buttonStyle, p.buttonStyle);
    const buttonContainerStyle = {
      marginLeft: '-4px',
      marginBottom: '4px'
    };
    objectAssign(buttonContainerStyle, p.buttonContainerStyle);
    return (
      <div>
        <div style={buttonContainerStyle}>
          <button
            disabled={this.state.preview}
            style={buttonStyle}
            onClick={(e)=>this.insertAtCursor(e, '**', true)}>
            <i className="fa fa-bold" />
          </button>
          <button
            disabled={this.state.preview}
            style={buttonStyle}
            onClick={(e)=>this.insertAtCursor(e, '_', true)}>
            <i className="fa fa-italic" />
          </button>
          <button
            disabled={this.state.preview}
            style={buttonStyle}
            onClick={(e)=>this.insertAtCursor(e, '### ', false)}>
            <i className="fa fa-header" />
          </button>
          <button
            disabled={this.state.preview}
            style={buttonStyle}
            onClick={(e)=>this.handleList(e, false)}>
            <i className="fa fa-list" />
          </button>
          <button
            disabled={this.state.preview}
            style={buttonStyle}
            onClick={(e)=>this.handleList(e, true)}>
            <i className="fa fa-list-ol" />
          </button>
          {p.enableHTML ?
            <button
              disabled={this.state.preview}
              style={buttonStyle}
              onClick={(e)=>this.insertAtCursor(e, '<blockquote>', true, null, '</blockquote>', 12)}>
              <i className="fa fa-quote-right" />
            </button> : null}
          <button
            disabled={this.state.preview}
            style={buttonStyle}
            onClick={(e)=>this.insertAtCursor(e, '```', true, null, '```', 3)}>
            <i className="fa fa-code" />
          </button>
          <button
            disabled={this.state.preview}
            style={buttonStyle}
            onClick={(e)=>this.insertAtCursor(e, '[', true, null, ']()', 3)}>
            <i className="fa fa-link" />
          </button>
          <button
            disabled={this.state.preview}
            style={buttonStyle}
            onClick={(e)=>this.insertAtCursor(e, '![](', true, null, ')', 4)}>
            <i className="fa fa-file-image-o" />
          </button>
          <button
            disabled={this.state.preview}
            style={buttonStyle}
            onClick={this.handleYoutube}>
            <i className="fa fa-youtube" />
          </button>
        </div>
        <div>
          <textarea
            ref="text"
            placeholder={this.props.placeholder}
            rows={this.props.rows}
            cols={this.props.cols}
            style={textAreaStyle}
            value={p.value}
            onChange={this.handleTextChange}
          />
        </div>
      </div>
    );
  }
}

window.MDEditor = MDEditor;
export default MDEditor;
