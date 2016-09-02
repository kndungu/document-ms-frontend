import { connect } from 'react-redux';

import AddDocument from '../../../components/home/UserHome/Body/AddDocument/index.jsx';

const mapStateToProps = (state) => {
  return ({
    addDocumentOpen: state.dialogs.getIn(['dialogs', 'addDocumentOpen'])
  });
};

export default connect(mapStateToProps)(AddDocument);

