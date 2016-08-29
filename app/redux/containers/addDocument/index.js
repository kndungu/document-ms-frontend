import { connect } from 'react-redux';

import AddDocumentTab from
'../../../components/home/UserHome/body/AddDocument/AddDocumentTab.jsx';

const mapStateToProps = (state) => {
  return ({
    tags: state.addDocument.get('tags'),
    userDetails: state.auth.get('userDetails')
  });
};

export default connect(mapStateToProps)(AddDocumentTab);

