import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import request from 'superagent';
import { List, Map } from 'immutable';
import AutoComplete from 'material-ui/AutoComplete';
import Toggle from 'material-ui/Toggle';
import { Editor, EditorState, convertToRaw } from 'draft-js';
import store from '../../../../../redux/store';
import constants from '../../../../../redux/constants';
import styles from './styles';

class AddDocumentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tag: '',
      public: true,
      titleState: EditorState.createEmpty(),
      contentState: EditorState.createEmpty()
    };

    this.titleChange = (titleState) => this.setState({ titleState });
    this.contentChange = (contentState) => this.setState({ contentState });

    this.createDocument = this.createDocument.bind(this);
  }

  createDocument() {
    const title = convertToRaw(this.state.titleState.getCurrentContent());
		const content = convertToRaw(this.state.contentState.getCurrentContent());
		console.log(this.state.tag)
    request
      .post('api/documents')
      .send({
        title: JSON.stringify(title),
        content: JSON.stringify(content),
        tags: [this.state.tag],
        accessibleBy: this.state.public ? ['user'] : [this.props.userDetails.get('username')]
      })
      .set('x-access-token', localStorage.getItem('token'))
      .end((error, response) => {
        if (error) {
          return null;
        }
        console.log(response.body);

        store.dispatch({ type: constants.TOGGLE_ADD_DOCUMENT });
      });
  }

  render() {
    let categories = this.props.categories.toJS();
    categories = categories.map((categoryObject) => {
      return categoryObject.title;
    });
    return (
      <div style={styles.divStyle}>
        <div style={styles.fieldStyle}>
          <AutoComplete
            style={{ width: '100%' }}
            floatingLabelText="Choose or create category"
            filter={AutoComplete.fuzzyFilter}
            openOnFocus
            dataSource={categories}
            onNewRequest={(chosen) => {
              this.setState({
                category: chosen
              });
            }}
            onBlur={(event) => {
              console.log(this.state.category)
              this.setState({
                tag: event.target.value
              });
            }}
          />
        </div>
        <div style={styles.fieldStyle}>
          <p>Title</p>
        </div>
        <div style={styles.titleStyle}>
          <Editor editorState={this.state.titleState} onChange={this.titleChange} />
        </div>
        <div style={styles.fieldStyle}>
          <p>Content</p>
        </div>
        <div style={styles.contentStyle}>
          <Editor editorState={this.state.contentState} onChange={this.contentChange} />
        </div>
        <div style={styles.fieldStyle}>
          <Toggle
            style={{ width: '100px', marginTop: '20px', marginBottom: '10px' }}
            label="Public"
            defaultToggled
            onToggle={() => {
              this.setState({ public: !this.state.public });
            }}
          />
        </div>
        <FlatButton
          style={styles.buttonStyle}
          label="Add"
          onClick={this.createDocument}
        />
      </div>
    );
  }
}

AddDocumentForm.propTypes = {
  categories: React.PropTypes.instanceOf(List),
  userDetails: React.PropTypes.instanceOf(Map)
};

export default AddDocumentForm;

