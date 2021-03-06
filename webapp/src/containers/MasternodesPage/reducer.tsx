import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  masternodes: [],
  isMasternodesLoaded: false,
  isLoadingMasternodes: false,
  masternodesLoadError: '',
  isMasterNodeCreating: false,
  createdMasterNodeData: {},
  isErrorCreatingMasterNode: '',
  isMasterNodeResigning: false,
  resignedMasterNodeData: '',
  isErrorResigningMasterNode: '',
  isRestartNode: false,
  isMasterNodeOwner: false,
  isMasterNodeOwnerError: '',
};

const configSlice = createSlice({
  name: 'masternode',
  initialState,
  reducers: {
    fetchMasternodesRequest(state) {
      state.isLoadingMasternodes = true;
    },
    fetchMasternodesSuccess(state, action) {
      state.masternodes = action.payload.masternodes;
      state.isLoadingMasternodes = false;
      state.isMasternodesLoaded = true;
    },
    fetchMasternodesFailure(state, action) {
      state.masternodes = [];
      state.isLoadingMasternodes = false;
      state.isMasternodesLoaded = true;
    },
    createMasterNode(state, action) {
      state.isMasterNodeCreating = true;
      state.createdMasterNodeData = {};
      state.isErrorCreatingMasterNode = '';
    },
    createMasterNodeSuccess(state, action) {
      state.isMasterNodeCreating = false;
      state.createdMasterNodeData = action.payload;
      state.isErrorCreatingMasterNode = '';
    },
    createMasterNodeFailure(state, action) {
      state.isMasterNodeCreating = false;
      state.createdMasterNodeData = {};
      state.isErrorCreatingMasterNode = action.payload;
    },
    resignMasterNode(state, action) {
      state.isMasterNodeResigning = true;
      state.resignedMasterNodeData = '';
      state.isErrorResigningMasterNode = '';
    },
    resignMasterNodeSuccess(state, action) {
      state.isMasterNodeResigning = false;
      state.resignedMasterNodeData = action.payload;
      state.isErrorResigningMasterNode = '';
    },
    resignMasterNodeFailure(state, action) {
      state.isMasterNodeResigning = false;
      state.resignedMasterNodeData = '';
      state.isErrorResigningMasterNode = action.payload;
    },
    startRestartNodeWithMasterNode(state) {
      state.isRestartNode = true;
    },
    finishRestartNodeWithMasterNode(state) {
      state.isRestartNode = false;
    },
    setMasterNodeOwner(state, action) {
      state.isMasterNodeOwner = false;
      state.isMasterNodeOwnerError = '';
    },
    setMasterNodeOwnerSuccess(state, action) {
      state.isMasterNodeOwner = action.payload;
      state.isMasterNodeOwnerError = '';
    },
    setMasterNodeOwnerError(state, action) {
      state.isMasterNodeOwner = false;
      state.isMasterNodeOwnerError = action.payload;
    },
  },
});

const { actions, reducer } = configSlice;

export const {
  fetchMasternodesRequest,
  fetchMasternodesSuccess,
  fetchMasternodesFailure,
  createMasterNode,
  createMasterNodeSuccess,
  createMasterNodeFailure,
  resignMasterNode,
  resignMasterNodeSuccess,
  resignMasterNodeFailure,
  startRestartNodeWithMasterNode,
  finishRestartNodeWithMasterNode,
  setMasterNodeOwner,
  setMasterNodeOwnerSuccess,
  setMasterNodeOwnerError,
} = actions;

export default reducer;
